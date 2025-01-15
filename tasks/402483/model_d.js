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
        return false;
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
      if (!order || typeof order !== 'object') {
        return false;
      }
  
      // First check if we have enough of all items
      for (const [itemName, quantity] of Object.entries(order)) {
        if (!this.hasEnough(itemName, quantity)) {
          return false;
        }
      }
  
      // If we have enough of everything, remove the items
      for (const [itemName, quantity] of Object.entries(order)) {
        this.removeItem(itemName, quantity);
      }
  
      return true;
    }
  
    hasEnough(name, quantity) {
      if (quantity <= 0) {
        return false;
      }
      
      return this.getItemCount(name) >= quantity;
    }
  }
  
  function fulfillOrder(inventory, order) {
    return inventory.processOrder(order);
  }
  
  module.exports = { Inventory, fulfillOrder };