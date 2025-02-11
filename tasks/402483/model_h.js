class Inventory {
  // ...

  removeItem(name, quantity) {
    if (!this.hasItem(name)) {
      throw new Error(`Item '${name}' does not exist in the inventory.`);
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be a positive integer.');
    }

    if (this.items[name] < quantity) {
      throw new Error(`Not enough quantity of item '${name}' in the inventory.`);
    }

    this.items[name] -= quantity;
  }

  hasEnough(name, quantity) {
    if (quantity <= 0) {
      return false;
    }

    return this.getItemCount(name) >= quantity;
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
}