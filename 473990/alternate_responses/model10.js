class InventoryManager {
  constructor() {
    this.products = [];
    this.supplierOrders = [];
  }

  addProduct(productData) {
    // Validate product data
    if (!productData.name || typeof productData.name !== "string") {
      throw new Error("Product name is required and must be a string");
    }
    if (this.products.find((p) => p.name === productData.name)) {
      throw new Error(`Product '${productData.name}' already exists`);
    }
    if (
      productData.price < 0 ||
      productData.restockThreshold < 0 ||
      productData.autoReorderQuantity < 0
    ) {
      throw new Error(
        "Price, restockThreshold, and autoReorderQuantity must be >= 0"
      );
    }
    if (productData.warehouses && typeof productData.warehouses !== "object") {
      throw new Error("Warehouses must be an object");
    }

    // Add product to inventory
    this.products.push({
      name: productData.name,
      price: productData.price,
      restockThreshold: productData.restockThreshold,
      autoReorderQuantity: productData.autoReorderQuantity,
      warehouses: productData.warehouses || {},
    });
  }

  addProductBatch(productName, warehouseName, batchInfo) {
    // Find product in inventory
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist`);
    }

    // Validate batch info
    if (!batchInfo.batchId || typeof batchInfo.batchId !== "string") {
      throw new Error("Batch ID is required and must be a string");
    }
    if (batchInfo.quantity < 0) {
      throw new Error("Batch quantity must be >= 0");
    }
    if (!batchInfo.expiryDate || typeof batchInfo.expiryDate !== "string") {
      throw new Error("Expiry date is required and must be a string");
    }
    const expiryDate = new Date(batchInfo.expiryDate);
    if (expiryDate < new Date()) {
      throw new Error(
        `Cannot add expired batch. Expiry date: ${batchInfo.expiryDate}`
      );
    }

    // Add batch to warehouse
    if (!product.warehouses[warehouseName]) {
      product.warehouses[warehouseName] = [];
    }
    if (
      product.warehouses[warehouseName].find(
        (b) => b.batchId === batchInfo.batchId
      )
    ) {
      throw new Error(
        `Batch ID '${batchInfo.batchId}' already exists in warehouse '${warehouseName}'`
      );
    }
    product.warehouses[warehouseName].push(batchInfo);
  }

  sellItems(productName, warehouseName, quantity) {
    // Find product in inventory
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist`);
    }

    // Find warehouse and batches
    const warehouse = product.warehouses[warehouseName];
    if (!warehouse) {
      throw new Error(
        `Warehouse '${warehouseName}' does not exist for product '${productName}'`
      );
    }
    const batches = warehouse.filter(
      (b) => new Date(b.expiryDate) >= new Date()
    );

    // Check if there is enough stock
    const totalStock = batches.reduce((acc, b) => acc + b.quantity, 0);
    if (totalStock < quantity) {
      throw new Error(
        `Insufficient stock in '${warehouseName}'. Requested: ${quantity}, Available: ${totalStock}`
      );
    }

    // Sell items using FIFO logic
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

    // Check if total stock is below restock threshold
    const totalStockAfterSale = this.getStock(productName);
    if (totalStockAfterSale < product.restockThreshold) {
      this.autoRestock(productName);
    }
  }

  autoRestock(productName) {
    // Find product in inventory
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist`);
    }

    // Create supplier order
    const orderDate = new Date().toISOString().split("T")[0];
    const estimatedArrival = new Date(orderDate).setDate(
      new Date(orderDate).getDate() + 3
    );
    this.supplierOrders.push({
      productName,
      quantityOrdered: product.autoReorderQuantity,
      orderDate,
      estimatedArrival: new Date(estimatedArrival).toISOString().split("T")[0],
    });
  }

  receiveDelivery(productName, warehouseName, shipmentDetails) {
    // Find product in inventory
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist`);
    }

    // Add batch to warehouse
    this.addProductBatch(productName, warehouseName, shipmentDetails);
  }

  removeExpiredBatches() {
    // Remove expired batches from all warehouses
    for (const product of this.products) {
      for (const warehouse in product.warehouses) {
        product.warehouses[warehouse] = product.warehouses[warehouse].filter(
          (b) => new Date(b.expiryDate) >= new Date()
        );
      }
    }
  }

  getStock(productName) {
    // Find product in inventory
    const product = this.products.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`Product '${productName}' does not exist`);
    }

    // Calculate total stock
    let totalStock = 0;
    for (const warehouse in product.warehouses) {
      for (const batch of product.warehouses[warehouse]) {
        if (new Date(batch.expiryDate) >= new Date()) {
          totalStock += batch.quantity;
        }
      }
    }
    return totalStock;
  }

  getInventoryValue() {
    // Calculate total inventory value
    let totalValue = 0;
    for (const product of this.products) {
      totalValue += product.price * this.getStock(product.name);
    }
    return totalValue;
  }

  getLowStockItems() {
    // Find products with low stock
    const lowStockItems = [];
    for (const product of this.products) {
      if (this.getStock(product.name) < product.restockThreshold) {
        lowStockItems.push(product.name);
      }
    }
    return lowStockItems;
  }
}

module.exports = { InventoryManager };
