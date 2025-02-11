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
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid item name');
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }
    if (!this.items[name]) {
      throw new Error('Item not found in inventory');
    }
    if (this.items[name] < quantity) {
      throw new Error('Insufficient quantity in inventory');
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

  hasEnough(name, quantity) {
    if (!name || typeof name !== 'string' || 
        !Number.isInteger(quantity) || quantity <= 0) {
      return false;
    }
    return this.getItemCount(name) >= quantity;
  }

  processOrder(order) {
    if (!order || typeof order !== 'object') {
      throw new Error('Invalid order');
    }

    // Check if we have enough of each item
    for (const [itemName, quantity] of Object.entries(order)) {
      if (!this.hasEnough(itemName, quantity)) {
        return false;
      }
    }

    // If we have enough of everything, process the order
    try {
      for (const [itemName, quantity] of Object.entries(order)) {
        this.removeItem(itemName, quantity);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

function fulfillOrder(inventory, order) {
  return inventory.processOrder(order);
}

module.exports = { Inventory, fulfillOrder };