class Inventory {
    constructor() {
      this.items = {};
    }
  
    validateItemName(name) {
      if (name === undefined || name === null) {
        throw new Error("Item name cannot be undefined or null");
      }
      if (typeof name !== "string") {
        throw new Error("Item name must be a string");
      }
      if (name.trim() === "") {
        throw new Error("Item name cannot be empty");
      }
    }
  
    validateQuantity(quantity) {
      if (quantity === undefined || quantity === null) {
        throw new Error("Quantity cannot be undefined or null");
      }
      if (typeof quantity !== "number") {
        throw new Error("Quantity must be a number");
      }
      if (!Number.isInteger(quantity)) {
        throw new Error("Quantity must be an integer");
      }
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative");
      }
    }
  
    addItem(name, quantity) {
      this.validateItemName(name);
      this.validateQuantity(quantity);
  
      if (this.items[name]) {
        this.items[name] += quantity;
      } else {
        this.items[name] = quantity;
      }
    }
  
    removeItem(name, quantity) {
      this.validateItemName(name);
      this.validateQuantity(quantity);
  
      if (this.items[name]) {
        this.items[name] = Math.max(0, this.items[name] - quantity);
      }
    }
  
    getItemCount(name) {
      return this.items[name] || 0;
    }
  
    hasItem(name) {
      try {
        this.validateItemName(name);
        return this.getItemCount(name) > 0;
      } catch (error) {
        return false;
      }
    }
  
    isEmpty() {
      for (const itemName in this.items) {
        if (this.getItemCount(itemName) > 0) {
          return false;
        }
      }
      return true;
    }
  
    hasEnough(name, quantity) {
      try {
        this.validateItemName(name);
        this.validateQuantity(quantity);
        return this.getItemCount(name) >= quantity;
      } catch (error) {
        return false;
      }
    }
  
    processOrder(order) {
      if (!order || typeof order !== "object") {
        return false;
      }
  
      // Validate all items in the order first
      for (const itemName in order) {
        try {
          this.validateItemName(itemName);
          this.validateQuantity(order[itemName]);
        } catch (error) {
          return false;
        }
  
        if (!this.hasEnough(itemName, order[itemName])) {
          return false;
        }
      }
  
      // If all validations pass, process the order
      for (const itemName in order) {
        this.removeItem(itemName, order[itemName]);
      }
      return true;
    }
  }
  
  function fulfillOrder(inventory, order) {
    return inventory.processOrder(order);
  }
  
  module.exports = { Inventory, fulfillOrder };