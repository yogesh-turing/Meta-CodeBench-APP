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
      if (typeof productData.warehouses !== "object") {
        throw new Error("Warehouses must be an object.");
      }

      Object.entries(productData.warehouses).forEach(([name, batches]) => {
        if (typeof name !== "string") {
          throw new Error("Warehouse names must be strings.");
        }
        if (!Array.isArray(batches)) {
          throw new Error("Warehouse batches must be an array.");
        }
      });
    }

    this.products.push({
      ...productData,
      warehouses: productData.warehouses || {},
    });
  }

  addProductBatch(productName, warehouseName, batchInfo) {
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    if (batchInfo.quantity < 0) {
      throw new Error("Batch quantity must be non-negative.");
    }

    const expiryDate = new Date(batchInfo.expiryDate);
    if (isNaN(expiryDate.getTime())) {
      throw new Error("Invalid expiry date format. Use YYYY-MM-DD.");
    }

    if (expiryDate < new Date()) {
      throw new Error(
        `Cannot add expired batch. Expiry date: ${batchInfo.expiryDate}`
      );
    }

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

    if (!product.warehouses[warehouseName]) {
      throw new Error(`Warehouse '${warehouseName}' does not exist.`);
    }

    const warehouse = product.warehouses[warehouseName];
    const currentDate = new Date();
    const validBatches = warehouse
      .filter((batch) => new Date(batch.expiryDate) > currentDate)
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    const totalAvailable = validBatches.reduce(
      (sum, batch) => sum + batch.quantity,
      0
    );
    if (totalAvailable < quantity) {
      throw new Error(
        `Insufficient stock in '${warehouseName}'. Requested: ${quantity}, Available: ${totalAvailable}`
      );
    }

    let remainingToSell = quantity;
    for (const batch of validBatches) {
      if (batch.quantity >= remainingToSell) {
        batch.quantity -= remainingToSell;
        remainingToSell = 0;
        break;
      } else {
        remainingToSell -= batch.quantity;
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

    this.addProductBatch(productName, warehouseName, shipmentDetails);
  }

  removeExpiredBatches() {
    const currentDate = new Date();
    this.products.forEach((product) => {
      Object.keys(product.warehouses).forEach((warehouseName) => {
        product.warehouses[warehouseName] = product.warehouses[
          warehouseName
        ].filter((batch) => new Date(batch.expiryDate) > currentDate);
      });
    });
  }

  getStock(productName) {
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    const currentDate = new Date();
    return Object.values(product.warehouses).reduce((total, warehouse) => {
      return (
        total +
        warehouse
          .filter((batch) => new Date(batch.expiryDate) > currentDate)
          .reduce((sum, batch) => sum + batch.quantity, 0)
      );
    }, 0);
  }

  getInventoryValue() {
    return this.products.reduce((total, product) => {
      const productStock = this.getStock(product.name);
      return total + product.price * productStock;
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
