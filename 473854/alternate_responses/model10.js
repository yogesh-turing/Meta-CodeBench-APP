class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Stores key-value pairs
    this.head = { next: null, prev: null }; // Dummy head for doubly linked list
    this.tail = { next: null, prev: null }; // Dummy tail for doubly linked list
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    const node = this.cache.get(key);
    this._remove(node);
    this._add(node);
    return node.value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this._remove(node);
      this._add(node);
    } else {
      const node = { key, value, next: null, prev: null };
      this.cache.set(key, node);
      this._add(node);

      if (this.cache.size > this.capacity) {
        const lruNode = this.tail.prev;
        this._remove(lruNode);
        this.cache.delete(lruNode.key);
      }
    }
  }

  _remove(node) {
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
  }

  _add(node) {
    const prev = this.head;
    const next = this.head.next;
    prev.next = node;
    next.prev = node;
    node.prev = prev;
    node.next = next;
  }
}

module.exports = { LRUCache };