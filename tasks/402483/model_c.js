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
      if (!Number.isInteger(quantity) || quantity <= 0) {
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
  
      // Check if we have enough of all items first
      for (const [itemName, quantity] of Object.entries(order)) {
        if (!this.hasEnough(itemName, quantity)) {
          return false;
        }
      }
  
      // If we have enough of everything, process the order
      for (const [itemName, quantity] of Object.entries(order)) {
        this.removeItem(itemName, quantity);
      }
      
      return true;
    }
  
    hasEnough(name, quantity) {
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return false;
      }
      
      return (this.items[name] || 0) >= quantity;
    }
  }
  
  function fulfillOrder(inventory, order) {
    return inventory.processOrder(order);
  }
  
  module.exports = { Inventory, fulfillOrder };