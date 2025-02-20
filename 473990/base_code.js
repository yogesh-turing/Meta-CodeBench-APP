class InventoryManager {
  constructor() {
    this.products = [];
    this.supplierOrders = [];
  }

  addProduct(productData) {
    // TODO: Validate and add product for different warehouse structure and limit and other details
  }

  addProductBatch(productName, warehouseName, batchInfo) {
    // TODO: Validate and add a batch to the warehouse that is specified
  }

  sellItems(productName, warehouseName, quantity) {
    // TODO: Deduct from oldest batch more like the first in first out. so If total stock < the threshold, call the autoRestock
  }

  autoRestock(productName) {
    // TODO: Add an order to this.supplierOrders with a date
    // something like{ orderDate: 'April 1, 2025', estimatedArrival: 'April 3, 2025' }
  }

  receiveDelivery(productName, warehouseName, shipmentDetails) {
    // TODO: Add a new batch to the product's warehouse after an autoRestock
  }

  removeExpiredBatches() {
    // TODO: Remove or mark batches whose expiryDate is in the past
  }

  getStock(productName) {
    // TODO: Sum all batches in all warehouses for the given product
  }

  getInventoryValue() {
    // TODO: Sum price * total stock across all products
  }

  getLowStockItems() {
    // TODO: Return names of products that their total stock is less than restockThreshold
  }
}

module.exports = { InventoryManager };
