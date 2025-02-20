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
    if (typeof capacity !== 'number' || capacity < 0) {
      throw new Error('Capacity must be a non-negative number.');
    }
    this.capacity = capacity;
    this.cache = new Map(); // Stores key-node pairs for O(1) access
    this.head = new Node(0, 0); // Dummy head
    this.tail = new Node(0, 0); // Dummy tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key);
    this._removeNode(node);
    this._addToFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.capacity === 0) return; // If capacity is 0, don't store anything

    if (this.cache.has(key)) {
      const existingNode = this.cache.get(key);
      existingNode.value = value; // Update value
      this._removeNode(existingNode);
      this._addToFront(existingNode);
    } else {
      if (this.cache.size >= this.capacity) {
        const lruNode = this.tail.prev;
        this._removeNode(lruNode);
        this.cache.delete(lruNode.key);
      }
      const newNode = new Node(key, value);
      this.cache.set(key, newNode);
      this._addToFront(newNode);
    }
  }
}

module.exports = { LRUCache };