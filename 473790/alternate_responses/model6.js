class RideRequest {
  constructor(id, passengerName, latitude, longitude, priority = "regular") {
    this.id = id;
    this.passengerName = passengerName;
    this.latitude = latitude;
    this.longitude = longitude;
    this.priority = priority;
    this.timestamp = Date.now();
    this.waitTime = 0;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  insertAtFront(node) {
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
  }

  insertAtTail(node) {
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
  }

  remove(node) {
    if (node.prev !== null) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next !== null) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current !== null) {
      result.push(current);
      current = current.next;
    }
    return result;
  }
}

class RideManager {
  constructor() {
    this.priorityQueues = {
      VIP: new DoublyLinkedList(),
      emergency: new DoublyLinkedList(),
      regular: new DoublyLinkedList(),
    };
    this.rides = new Map();
    this.sorting = new Sorting();
    this.trie = new Trie();

    this.expirationHeap = new MinHeap();
    this.defaultExpiration = 10;
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  addRide(ride) {
    this.rides.set(ride.id, ride);
    this.priorityQueues[ride.priority].insertAtTail(ride);
    this.trie.insert(ride.passengerName, ride);
    this.expirationHeap.push({ rideId: ride.id, expirationTime: Date.now() + this.defaultExpiration * 60000 });
  }

  removeRide(ride) {
    this.rides.delete(ride.id);
    this.priorityQueues[ride.priority].remove(ride);
    this.trie.remove(ride.passengerName, ride);
    this.expirationHeap.remove({ rideId: ride.id });
  }

  changePriority(ride, newPriority) {
    this.priorityQueues[ride.priority].remove(ride);
    ride.priority = newPriority;
    this.priorityQueues[newPriority].insertAtTail(ride);
  }

  getAllActiveRides() {
    const activeRides = [];
    for (const priority in this.priorityQueues) {
      activeRides.push(...this.priorityQueues[priority].toArray());
    }
    return activeRides;
  }

  rideComparator(driverLocation) {
    const priorityRank = { VIP: 0, emergency: 1, regular: 2 };
    return (ride1, ride2) => {
      if (priorityRank[ride1.priority] !== priorityRank[ride2.priority]) {
        return priorityRank[ride1.priority] - priorityRank[ride2.priority];
      }

      const distance1 = this.haversineDistance(driverLocation.latitude, driverLocation.longitude, ride1.latitude, ride1.longitude);
      const distance2 = this.haversineDistance(driverLocation.latitude, driverLocation.longitude, ride2.latitude, ride2.longitude);

      if (distance1 !== distance2) {
        return distance1 - distance2;
      }

      return ride1.waitTime - ride2.waitTime;
    };
  }

  updateWaitTimes() {
    const now = Date.now();
    this.rides.forEach((ride) => {
      ride.waitTime = Math.floor((now - ride.timestamp) / 60000);
    });
  }

  updateRidePriority(ride) {
    if (ride.waitTime >= 10 && ride.priority !== 'VIP') {
      this.changePriority(ride, 'VIP');
    } else if (ride.waitTime >= 5 && ride.priority !== 'emergency') {
      this.changePriority(ride, 'emergency');
    }
  }

  assignRideToDriver(driverLocation) {
    const activeRides = this.getAllActiveRides();
    const sortedRides = this.sorting.mergeSort(activeRides, this.rideComparator(driverLocation));
    const assignedRide = sortedRides[0];

    if (assignedRide) {
      this.removeRide(assignedRide);
      return assignedRide;
    }

    return null;
  }

  checkExpirations() {
    while (this.expirationHeap.size() > 0 && this.expirationHeap.peek().expirationTime <= Date.now()) {
      const expiredRideId = this.expirationHeap.pop().rideId;
      const expiredRide = this.rides.get(expiredRideId);
      if (expiredRide) {
        this.removeRide(expiredRide);
      }
    }
  }
}

class Sorting {
  mergeSort(arr, comparator) {
    if (arr.length <= 1) {
      return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return this.merge(this.mergeSort(left, comparator), this.mergeSort(right, comparator), comparator);
  }

  merge(left, right, comparator) {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (comparator(left[i], right[j]) <= 0) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

class TrieNode {
  constructor() {
    this.children = {};
    this.rides = [];
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(name, ride) {
    let node = this.root;
    for (const char of name.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.rides.push(ride);
  }

  search(prefix) {
    prefix = prefix.toLowerCase();
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    return this.collectAllRides(node);
  }

  collectAllRides(node) {
    let result = [];
    if (node.isEndOfWord) {
      result = result.concat(node.rides);
    }
    for (const child in node.children) {
      result = result.concat(this.collectAllRides(node.children[child]));
    }
    return result;
  }

  remove(name, ride) {
    let node = this.root;
    for (const char of name.toLowerCase()) {
      if (!node.children[char]) {
        return;
      }
      node = node.children[char];
    }
    node.rides = node.rides.filter((r) => r.id !== ride.id);
  }
}

class MinHeap {
  constructor() {
    this.heap = [];
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  left(i) {
    return 2 * i + 1;
  }

  right(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  push(item) {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  heapifyUp(i) {
    while (i > 0 && this.heap[this.parent(i)].expirationTime > this.heap[i].expirationTime) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  pop() {
    if (this.heap.length === 0) {
      return null;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const removed = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return removed;
  }

  heapifyDown(i) {
    let smallest = i;
    const left = this.left(i);
    const right = this.right(i);

    if (left < this.heap.length && this.heap[left].expirationTime < this.heap[smallest].expirationTime) {
      smallest = left;
    }

    if (right < this.heap.length && this.heap[right].expirationTime < this.heap[smallest].expirationTime) {
      smallest = right;
    }

    if (smallest !== i) {
      this.swap(i, smallest);
      this.heapifyDown(smallest);
    }
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  remove(item) {
    const index = this.heap.findIndex((i) => i.rideId === item.rideId);
    if (index !== -1) {
      this.heap.splice(index, 1);
      this.heapifyDown(index);
    }
  }
}

module.exports = {
  RideRequest,
  DoublyLinkedList,
  RideManager,
  Sorting,
  Trie,
  MinHeap,
};