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
    if (!this.items[name]) {
      throw new Error(`Item "${name}" does not exist in the inventory.`);
    }
    if (quantity < 1) {
      throw new Error(`Invalid quantity. Quantity must be a counting number.`);
    }
    if (this.items[name] < quantity) {
      throw new Error(`Not enough "${name}" in the inventory to remove ${quantity}.`);
    }
    this.items[name] -= quantity;
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
    if (typeof order !== 'object') {
      throw new Error('Invalid order format. Order must be an object.');
    }
    for (const itemName in order) {
      if (!this.hasEnough(itemName, order[itemName])) {
        return false;
      }
    }
    for (const itemName in order) {
      this.removeItem(itemName, order[itemName]);
    }
    return true;
  }

  hasEnough(name, quantity) {
    if (quantity < 1) {
      return false;
    }
    return this.getItemCount(name) >= quantity;
  }
}

function fulfillOrder(inventory, order) {
  return inventory.processOrder(order);
}

module.exports = { Inventory, fulfillOrder };