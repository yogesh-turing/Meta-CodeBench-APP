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
      throw new Error(`Item ${name} does not exist in the inventory.`);
    }

    if (quantity > this.items[name]) {
      throw new Error(`Not enough quantity of item ${name} in the inventory.`);
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
    for (const item in order) {
      if (!this.hasEnough(item, order[item])) {
        return false;
      }
    }

    for (const item in order) {
      this.removeItem(item, order[item]);
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