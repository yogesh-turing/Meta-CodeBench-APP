class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Stores key-value pairs
    this.head = new Node(0, 0); // Dummy head
    this.tail = new Node(0, 0); // Dummy tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
  }

  _addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      this._remove(node);
      this._addToHead(node);
      return node.value;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this._remove(node);
      this._addToHead(node);
    } else {
      if (this.cache.size === this.capacity) {
        const lruNode = this.tail.prev;
        this._remove(lruNode);
        this.cache.delete(lruNode.key);
      }
      const newNode = new Node(key, value);
      this._addToHead(newNode);
      this.cache.set(key, newNode);
    }
  }
}

module.exports = { LRUCache };