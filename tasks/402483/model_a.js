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
      
      if (!this.items[name] || this.items[name] < quantity) {
        throw new Error("Not enough items in inventory");
      }
      
      this.items[name] -= quantity;
      if (this.items[name] === 0) {
        delete this.items[name];
      }
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
      // First check if we have enough of all items
      for (const [itemName, quantity] of Object.entries(order)) {
        if (!this.hasEnough(itemName, quantity)) {
          return false;
        }
      }
      
      // If we have enough, remove all items
      try {
        for (const [itemName, quantity] of Object.entries(order)) {
          this.removeItem(itemName, quantity);
        }
        return true;
      } catch (error) {
        return false;
      }
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