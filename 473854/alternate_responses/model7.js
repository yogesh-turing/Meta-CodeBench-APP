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
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this.moveToFront(node);
    } else {
      if (this.cache.size === this.capacity) {
        this.evictLRU();
      }
      const node = new Node(key, value);
      this.cache.set(key, node);
      this.addToFront(node);
    }
  }

  moveToFront(node) {
    this.removeFromList(node);
    this.addToFront(node);
  }

  addToFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  removeFromList(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  evictLRU() {
    const lruNode = this.tail.prev;
    this.cache.delete(lruNode.key);
    this.removeFromList(lruNode);
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