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
      if (this.items[name]) {
        if (this.items[name] >= quantity) {
          this.items[name] -= quantity;
        } else {
          throw new Error(`Not enough ${name} in inventory to remove ${quantity}.`);
        }
      } else {
        throw new Error(`${name} does not exist in inventory.`);
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
      for (const name in order) {
        if (!this.hasEnough(name, order[name])) {
          return false;
        }
      }
      for (const name in order) {
        this.removeItem(name, order[name]);
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