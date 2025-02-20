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

    this.products[productData.name] = productData;
  }

  addProductBatch(productName, warehouseName, batchInfo) {
    if (!this.products[productName]) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    if (batchInfo.quantity < 0) {
      throw new Error("Batch quantity must be >= 0.");
    }

    const expiryDate = new Date(batchInfo.expiryDate);
    if (expiryDate < new Date()) {
      throw new Error(
        `Cannot add expired batch. Expiry date: ${batchInfo.expiryDate}`
      );
    }

    if (!this.products[productName].warehouses[warehouseName]) {
      this.products[productName].warehouses[warehouseName] = [];
    }

    const existingBatch = this.products[productName].warehouses[
      warehouseName
    ].find((batch) => batch.batchId === batchInfo.batchId);
    if (existingBatch) {
      throw new Error(
        `Batch '${batchInfo.batchId}' already exists in warehouse '${warehouseName}'.`
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

    const batches = this.products[productName].warehouses[warehouseName].filter(
      (batch) => new Date(batch.expiryDate) >= new Date()
    );
    batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    let remainingQuantity = quantity;
    for (const batch of batches) {
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
    const estimatedArrival = new Date(orderDate);
    estimatedArrival.setDate(estimatedArrival.getDate() + 3);
    const supplierOrder = {
      productName,
      quantityOrdered: this.products[productName].autoReorderQuantity,
      orderDate,
      estimatedArrival: estimatedArrival.toISOString().split("T")[0],
    };
    this.supplierOrders.push(supplierOrder);
  }

  receiveDelivery(productName, warehouseName, shipmentDetails) {
    if (!this.products[productName]) {
      throw new Error(`Product '${productName}' does not exist.`);
    }

    this.addProductBatch(productName, warehouseName, shipmentDetails);
  }

  removeExpiredBatches() {
    for (const product in this.products) {
      for (const warehouse in this.products[product].warehouses) {
        this.products[product].warehouses[warehouse] = this.products[
          product
        ].warehouses[warehouse].filter(
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
    for (const warehouse in this.products[productName].warehouses) {
      totalStock += this.products[productName].warehouses[warehouse].reduce(
        (acc, batch) => acc + batch.quantity,
        0
      );
    }
    return totalStock;
  }

  getInventoryValue() {
    let totalValue = 0;
    for (const product in this.products) {
      totalValue += this.products[product].price * this.getStock(product);
    }
    return totalValue;
  }

  getLowStockItems() {
    const lowStockItems = [];
    for (const product in this.products) {
      if (this.getStock(product) < this.products[product].restockThreshold) {
        lowStockItems.push(product);
      }
    }
    return lowStockItems;
  }
}

module.exports = { InventoryManager };
