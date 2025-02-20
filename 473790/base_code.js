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
    // Todo: Insert node at the front
  }
  insertAtTail(node) {
    // Todo: Insert node at the tail
  }
  remove(node) {
    // Todo: Remove a node from the list
  }
  toArray() {
    // Todo: return an array of all nodes in the list
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
    // Todo: Implement the haversine formula to calculate the distance between two points
  }
  addRide(ride) {
    // Todo: Add a ride to the system
  }
  removeRide(ride) {
    // Todo: Remove a ride from the system
  }
  changePriority(ride, newPriority) {
    // Todo: Change the priority of a ride upgrading or downgrading
  }
  getAllActiveRides() {
    let activeRides = [];
    // Todo: Return all active rides
    return activeRides;
  }
  rideComparator(driverLocation) {
    const priorityRank = { VIP: 0, emergency: 1, regular: 2 };
    // Todo: Implement the ride comparator function and return a sorted rides array by priority and distance
  }
  updateWaitTimes() {
    const now = Date.now();
    this.rides.forEach((ride) => {
      ride.waitTime = Math.floor((now - ride.timestamp) / 60000);
    });
  }
  updateRidePriority(ride) {
    // Todo: Update the ride priority based on the wait time
  }
  assignRideToDriver(driverLocation) {
    // Todo: assign the best ride to the driver based on the driver's location
  }
  checkExpirations() {
  // Todo
 }
}

class Sorting {
  mergeSort(arr, comparator) {
    // Todo: Implement merge sort
  }
  merge(left, right, comparator) {
    // Todo: Implement the merge function
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
    // Todo: Insert a ride into the trie
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
    // Todo: Implement heapify up
  }
  pop() {
    // Todo: Implement pop
  }
  heapifyDown(i) {
    // Todo: Implement heapify down
  }
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
  size() {
    return this.heap.length;
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