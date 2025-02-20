class InventoryManager {
  constructor() {
    this.products = [];
    this.supplierOrders = [];
  }

  addProduct(productData) {
    if (this.products.some((p) => p.name === productData.name)) {
      throw new Error(`Product '${productData.name}' already exists.`);
    }

    if (
      productData.price < 0 ||
      productData.restockThreshold < 0 ||
      productData.autoReorderQuantity < 0
    ) {
      throw new Error(
        "Price, restockThreshold, and autoReorderQuantity must be non-negative."
      );
    }

    const warehouses = {};
    if (productData.warehouses) {
      for (const [name, batches] of Object.entries(productData.warehouses)) {
        if (typeof name !== "string") {
          throw new Error("Warehouse names must be strings.");
        }
        warehouses[name] = batches.map((batch) => ({
          ...batch,
          quantity: Number(batch.quantity),
          expiryDate: new Date(batch.expiryDate),
        }));
      }
    }

    this.products.push({
      ...productData,
      warehouses,
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
        `Batch ID '${batchInfo.batchId}' already exists in ${warehouseName}`
      );
    }

    product.warehouses[warehouseName].push({
      ...batchInfo,
      quantity: Number(batchInfo.quantity),
      expiryDate,
    });
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

    const now = new Date();
    const validBatches = warehouse
      .filter((batch) => batch.expiryDate > now)
      .sort((a, b) => a.expiryDate - b.expiryDate);

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
    const now = new Date();
    for (const product of this.products) {
      for (const warehouseName in product.warehouses) {
        product.warehouses[warehouseName] = product.warehouses[
          warehouseName
        ].filter((batch) => batch.expiryDate > now);
      }
    }
  }

  getStock(productName) {
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    const now = new Date();
    let total = 0;
    for (const warehouse of Object.values(product.warehouses)) {
      total += warehouse
        .filter((batch) => batch.expiryDate > now)
        .reduce((sum, batch) => sum + batch.quantity, 0);
    }
    return total;
  }

  getInventoryValue() {
    return this.products.reduce((total, product) => {
      const stock = this.getStock(product.name);
      return total + stock * product.price;
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
