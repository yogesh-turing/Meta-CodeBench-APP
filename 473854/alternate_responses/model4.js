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
        this.cache = new Map(); // Stores key-node pairs
        this.head = new Node(0, 0); // Dummy head
        this.tail = new Node(0, 0); // Dummy tail
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    // Add node right after head
    addToFront(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    // Remove node from the list
    removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    get(key) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            // Move to front (mark as most recently used)
            this.removeNode(node);
            this.addToFront(node);
            return node.value;
        }
        return -1;
    }

    put(key, value) {
        // If key exists, update value and move to front
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            node.value = value;
            this.removeNode(node);
            this.addToFront(node);
            return;
        }

        // Create new node
        const newNode = new Node(key, value);
        this.cache.set(key, newNode);
        this.addToFront(newNode);

        // If over capacity, remove least recently used item
        if (this.cache.size > this.capacity) {
            const lru = this.tail.prev;
            this.removeNode(lru);
            this.cache.delete(lru.key);
        }
    }
}

module.exports = { LRUCache };