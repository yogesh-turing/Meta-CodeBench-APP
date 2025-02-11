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
      throw new Error(`Item '${name}' does not exist in the inventory.`);
    }

    if (this.items[name] < quantity) {
      throw new Error(`Not enough quantity of '${name}' in the inventory.`);
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

  hasEnough(name, quantity) {
    if (!this.items[name]) {
      return false;
    }

    if (this.items[name] < quantity) {
      return false;
    }

    return true;
  }

  processOrder(order) {
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
}

function fulfillOrder(inventory, order) {
  return inventory.processOrder(order);
}

module.exports = { Inventory, fulfillOrder };