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
      if (this.hasEnough(name, quantity)) {
        this.items[name] -= quantity;
      } else {
        throw new Error(`Not enough ${name} in inventory`);
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
      for (const item of order) {
        if (!this.hasEnough(item.name, item.quantity)) {
          return false;
        }
      }
      for (const item of order) {
        this.removeItem(item.name, item.quantity);
      }
      return true;
    }
  
    hasEnough(name, quantity) {
      return this.getItemCount(name) >= quantity;
    }
  }
  
  function fulfillOrder(inventory, order) {
    return inventory.processOrder(order);
  }
  
  module.exports = { Inventory, fulfillOrder };