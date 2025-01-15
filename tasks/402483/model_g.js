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
        throw new Error(`Not enough ${name} in stock to remove ${quantity}.`);
      }
    } else {
      throw new Error(`${name} is not in stock.`);
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
    return this.getItemCount(name) >= quantity;
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