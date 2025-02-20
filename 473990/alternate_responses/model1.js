class InventoryManager {
  constructor() {
    this.products = [];
    this.supplierOrders = [];
  }

  addProduct(productData) {
    // Validate product name uniqueness
    if (this.products.some((p) => p.name === productData.name)) {
      throw new Error(`Product '${productData.name}' already exists.`);
    }

    // Validate numeric fields
    const numericFields = ["price", "restockThreshold", "autoReorderQuantity"];
    numericFields.forEach((field) => {
      if (typeof productData[field] !== "number" || productData[field] < 0) {
        throw new Error(`${field} must be a non-negative number.`);
      }
    });

    // Validate warehouses if provided
    if (productData.warehouses) {
      Object.entries(productData.warehouses).forEach(([name, batches]) => {
        if (typeof name !== "string") {
          throw new Error("Warehouse names must be strings.");
        }
        if (!Array.isArray(batches)) {
          throw new Error("Warehouse batches must be an array.");
        }
        batches.forEach((batch) => this.validateBatch(batch));
      });
    }

    this.products.push({
      ...productData,
      warehouses: productData.warehouses || {},
    });
  }

  validateBatch(batch) {
    if (typeof batch.quantity !== "number" || batch.quantity < 0) {
      throw new Error("Batch quantity must be a non-negative number.");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(batch.expiryDate)) {
      throw new Error("Expiry date must be in YYYY-MM-DD format.");
    }
    if (new Date(batch.expiryDate) < new Date()) {
      throw new Error(
        `Cannot add expired batch. Expiry date: ${batch.expiryDate}`
      );
    }
  }

  addProductBatch(productName, warehouseName, batchInfo) {
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    this.validateBatch(batchInfo);

    if (!product.warehouses[warehouseName]) {
      product.warehouses[warehouseName] = [];
    }

    if (
      product.warehouses[warehouseName].some(
        (b) => b.batchId === batchInfo.batchId
      )
    ) {
      throw new Error(
        `Batch ID '${batchInfo.batchId}' already exists in ${warehouseName}.`
      );
    }

    product.warehouses[warehouseName].push(batchInfo);
  }

  sellItems(productName, warehouseName, quantity) {
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    const warehouse = product.warehouses[warehouseName];
    if (!warehouse) {
      throw new Error(`Warehouse '${warehouseName}' does not exist.`);
    }

    // Remove expired batches
    this.removeExpiredBatches();

    // Sort batches by expiry date (FIFO)
    const validBatches = warehouse
      .filter((batch) => new Date(batch.expiryDate) > new Date())
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    const availableStock = validBatches.reduce(
      (sum, batch) => sum + batch.quantity,
      0
    );
    if (availableStock < quantity) {
      throw new Error(
        `Insufficient stock in '${warehouseName}'. Requested: ${quantity}, Available: ${availableStock}`
      );
    }

    let remainingQuantity = quantity;
    for (const batch of validBatches) {
      if (batch.quantity >= remainingQuantity) {
        batch.quantity -= remainingQuantity;
        break;
      } else {
        remainingQuantity -= batch.quantity;
        batch.quantity = 0;
      }
    }

    // Clean up empty batches
    product.warehouses[warehouseName] = warehouse.filter(
      (batch) => batch.quantity > 0
    );

    // Check if restock is needed
    const totalStock = this.getStock(productName);
    if (totalStock < product.restockThreshold) {
      this.autoRestock(productName);
    }
  }

  autoRestock(productName) {
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    const orderDate = new Date();
    const estimatedArrival = new Date(orderDate);
    estimatedArrival.setDate(estimatedArrival.getDate() + 2); // Assuming 2 days delivery

    this.supplierOrders.push({
      productName,
      quantityOrdered: product.autoReorderQuantity,
      orderDate: orderDate.toISOString().split("T")[0],
      estimatedArrival: estimatedArrival.toISOString().split("T")[0],
    });
  }

  receiveDelivery(productName, warehouseName, shipmentDetails) {
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    this.validateBatch(shipmentDetails);
    this.addProductBatch(productName, warehouseName, shipmentDetails);
  }

  removeExpiredBatches() {
    const today = new Date();
    this.products.forEach((product) => {
      Object.keys(product.warehouses).forEach((warehouseName) => {
        product.warehouses[warehouseName] = product.warehouses[
          warehouseName
        ].filter((batch) => new Date(batch.expiryDate) > today);
      });
    });
  }

  getStock(productName) {
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    let total = 0;
    const today = new Date();
    Object.values(product.warehouses).forEach((batches) => {
      batches.forEach((batch) => {
        if (new Date(batch.expiryDate) > today) {
          total += batch.quantity;
        }
      });
    });
    return total;
  }

  getInventoryValue() {
    return this.products.reduce((total, product) => {
      return total + this.getStock(product.name) * product.price;
    }, 0);
  }

  getLowStockItems() {
    return this.products
      .filter(
        (product) => this.getStock(product.name) < product.restockThreshold
      )
      .map((product) => product.name);
  }
}

module.exports = { InventoryManager };
