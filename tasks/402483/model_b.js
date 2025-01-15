class Inventory {
    constructor() {
      this.items = {};
    }
  
    addItem(name, quantity) {
      if (this.items[name]) {
        this.items[name] += quantity;
      } else {
        this.items[name] = quantity;
      }
    }
  
    removeItem(name, quantity) {
      if (quantity <= 0) {
        throw new Error("Quantity must be positive");
      }
      
      if (!this.hasEnough(name, quantity)) {
        return false;
      }
      
      this.items[name] -= quantity;
      return true;
    }
  
    getItemCount(name) {
      return this.items[name] || 0;
    }
  
    hasItem(name) {
      return this.items[name] > 0;
    }
  
    isEmpty() {
      for (const itemName in this.items) {
        if (this.items[itemName] > 0) {
          return false;
        }
      }
      return true;
    }
  
    processOrder(order) {
      // Check if all items in order are available in sufficient quantity
      for (const [itemName, quantity] of Object.entries(order)) {
        if (!this.hasEnough(itemName, quantity)) {
          return false;
        }
      }
      
      // Process the order by removing items from inventory
      for (const [itemName, quantity] of Object.entries(order)) {
        this.removeItem(itemName, quantity);
      }
      
      return true;
    }
  
    hasEnough(name, quantity) {
      if (quantity <= 0) {
        throw new Error("Quantity must be positive");
      }
      return this.getItemCount(name) >= quantity;
    }
  }
  
  function fulfillOrder(inventory, order) {
    return inventory.processOrder(order);
  }
  
  module.exports = { Inventory, fulfillOrder };