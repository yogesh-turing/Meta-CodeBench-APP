class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Stores key-value pairs
    this.head = new Node(null, null); // Dummy head node
    this.tail = new Node(null, null); // Dummy tail node
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      this.moveToFront(node);
      return node.value;
    }
    return -1; // Key not found
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this.moveToFront(node);
    } else {
      const newNode = new Node(key, value);
      this.cache.set(key, newNode);
      this.addToFront(newNode);
      if (this.cache.size > this.capacity) {
        const lruNode = this.removeLRU();
        this.cache.delete(lruNode.key);
      }
    }
  }

  // Helper methods
  moveToFront(node) {
    this.removeNode(node);
    this.addToFront(node);
  }

  addToFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  removeLRU() {
    const lruNode = this.tail.prev;
    this.removeNode(lruNode);
    return lruNode;
  }
}

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

module.exports = { LRUCache };