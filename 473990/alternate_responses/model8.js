class InventoryManager {
  constructor() {
    this.products = {};
    this.supplierOrders = [];
  }

  addProduct(productData) {
    if (this.products[productData.name]) {
      throw new Error(`Product '${productData.name}' already exists.`);
    }

    if (
      productData.price < 0 ||
      productData.restockThreshold < 0 ||
      productData.autoReorderQuantity < 0
    ) {
      throw new Error(
        "Price, restockThreshold, and autoReorderQuantity must be >= 0."
      );
    }

    this.products[productData.name] = {
      price: productData.price,
      restockThreshold: productData.restockThreshold,
      autoReorderQuantity: productData.autoReorderQuantity,
      warehouses: productData.warehouses || {},
    };

    // Validate warehouses
    for (const warehouseName in this.products[productData.name].warehouses) {
      if (typeof warehouseName !== "string") {
        throw new Error("Warehouse names must be strings.");
      }

      for (const batch of this.products[productData.name].warehouses[
        warehouseName
      ]) {
        if (batch.quantity < 0) {
          throw new Error("Batch quantity must be >= 0.");
        }

        if (new Date(batch.expiryDate) < new Date()) {
          throw new Error(
            `Cannot add expired batch. Expiry date: ${batch.expiryDate}`
          );
        }
      }
    }
  }

  addProductBatch(productName, warehouseName, batchInfo) {
    if (!this.products[productName]) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    if (!this.products[productName].warehouses[warehouseName]) {
      this.products[productName].warehouses[warehouseName] = [];
    }

    for (const batch of this.products[productName].warehouses[warehouseName]) {
      if (batch.batchId === batchInfo.batchId) {
        throw new Error(
          `Batch ID '${batchInfo.batchId}' already exists in warehouse '${warehouseName}'.`
        );
      }
    }

    if (batchInfo.quantity < 0) {
      throw new Error("Batch quantity must be >= 0.");
    }

    if (new Date(batchInfo.expiryDate) < new Date()) {
      throw new Error(
        `Cannot add expired batch. Expiry date: ${batchInfo.expiryDate}`
      );
    }

    this.products[productName].warehouses[warehouseName].push(batchInfo);
  }

  sellItems(productName, warehouseName, quantity) {
    if (!this.products[productName]) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    if (!this.products[productName].warehouses[warehouseName]) {
      throw new Error(
        `Warehouse '${warehouseName}' does not exist for product '${productName}'.`
      );
    }

    const batches = this.products[productName].warehouses[warehouseName];
    const sortedBatches = batches.sort(
      (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
    );

    let remainingQuantity = quantity;
    for (const batch of sortedBatches) {
      if (new Date(batch.expiryDate) < new Date()) {
        continue; // Skip expired batches
      }

      if (batch.quantity >= remainingQuantity) {
        batch.quantity -= remainingQuantity;
        remainingQuantity = 0;
        break;
      } else {
        remainingQuantity -= batch.quantity;
        batch.quantity = 0;
      }
    }

    if (remainingQuantity > 0) {
      const availableQuantity = batches.reduce(
        (acc, batch) => acc + batch.quantity,
        0
      );
      throw new Error(
        `Insufficient stock in '${warehouseName}'. Requested: ${quantity}, Available: ${availableQuantity}`
      );
    }

    const totalStock = this.getStock(productName);
    if (totalStock < this.products[productName].restockThreshold) {
      this.autoRestock(productName);
    }
  }

  autoRestock(productName) {
    if (!this.products[productName]) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    const orderDate = new Date().toISOString().split("T")[0];
    const estimatedArrival = new Date(
      new Date().getTime() + 2 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    this.supplierOrders.push({
      productName,
      quantityOrdered: this.products[productName].autoReorderQuantity,
      orderDate,
      estimatedArrival,
    });
  }

  receiveDelivery(productName, warehouseName, shipmentDetails) {
    if (!this.products[productName]) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    this.addProductBatch(productName, warehouseName, shipmentDetails);
  }

  removeExpiredBatches() {
    for (const productName in this.products) {
      for (const warehouseName in this.products[productName].warehouses) {
        this.products[productName].warehouses[warehouseName] = this.products[
          productName
        ].warehouses[warehouseName].filter(
          (batch) => new Date(batch.expiryDate) >= new Date()
        );
      }
    }
  }

  getStock(productName) {
    if (!this.products[productName]) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    let totalStock = 0;
    for (const warehouseName in this.products[productName].warehouses) {
      for (const batch of this.products[productName].warehouses[
        warehouseName
      ]) {
        if (new Date(batch.expiryDate) >= new Date()) {
          totalStock += batch.quantity;
        }
      }
    }

    return totalStock;
  }

  getInventoryValue() {
    let totalValue = 0;
    for (const productName in this.products) {
      totalValue +=
        this.products[productName].price * this.getStock(productName);
    }

    return totalValue;
  }

  getLowStockItems() {
    const lowStockItems = [];
    for (const productName in this.products) {
      if (
        this.getStock(productName) < this.products[productName].restockThreshold
      ) {
        lowStockItems.push(productName);
      }
    }

    return lowStockItems;
  }
}

module.exports = { InventoryManager };
