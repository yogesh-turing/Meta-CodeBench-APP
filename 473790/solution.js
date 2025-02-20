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
    node.next = this.head;
    node.prev = null;
    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  insertAtTail(node) {
    node.next = null;
    node.prev = this.tail;

    if (this.tail) {
      this.tail.next = node;
    }
    this.tail = node;

    if (!this.head) {
      this.head = node;
    }
  }

  remove(node) {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    node.next = null;
    node.prev = null;
  }

  toArray() {
    let arr = [];
    let current = this.head;
    while (current) {
      arr.push(current);
      current = current.next;
    }
    return arr;
  }
}

class Sorting {
  mergeSort(arr, comparator) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid), comparator);
    const right = this.mergeSort(arr.slice(mid), comparator);

    return this.merge(left, right, comparator);
  }

  merge(left, right, comparator) {
    let result = [];
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

    while (i < left.length) {
      result.push(left[i]);
      i++;
    }
    while (j < right.length) {
      result.push(right[j]);
      j++;
    }

    return result;
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
    name = name.toLowerCase();

    for (const char of name) {
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
    while (i > 0) {
      const p = this.parent(i);
      if (this.heap[i].expirationTime < this.heap[p].expirationTime) {
        this.swap(i, p);
        i = p;
      } else {
        break;
      }
    }
  }

  pop() {
    if (this.heap.length === 0) return null;

    this.swap(0, this.heap.length - 1);
    const item = this.heap.pop();
    this.heapifyDown(0);
    return item;
  }

  heapifyDown(i) {
    let left = this.left(i);
    let right = this.right(i);
    let smallest = i;

    if (
      left < this.heap.length &&
      this.heap[left].expirationTime < this.heap[smallest].expirationTime
    ) {
      smallest = left;
    }
    if (
      right < this.heap.length &&
      this.heap[right].expirationTime < this.heap[smallest].expirationTime
    ) {
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
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;
  }

  addRide(ride) {
    this.rides.set(ride.id, ride);

    if (ride.priority === "VIP") {
      this.priorityQueues.VIP.insertAtFront(ride);
    } else {
      this.priorityQueues[ride.priority].insertAtTail(ride);
    }

    this.trie.insert(ride.passengerName, ride);

    const expirationTime = ride.timestamp + this.defaultExpiration * 60 * 1000;
    this.expirationHeap.push({ rideId: ride.id, expirationTime });
  }

  removeRide(ride) {
    if (!this.rides.has(ride.id)) return;

    this.rides.delete(ride.id);

    this.priorityQueues[ride.priority].remove(ride);
  }

  changePriority(ride, newPriority) {
    if (ride.priority === newPriority) return;

    this.priorityQueues[ride.priority].remove(ride);

    ride.priority = newPriority;

    if (newPriority === "VIP") {
      this.priorityQueues.VIP.insertAtFront(ride);
    } else {
      this.priorityQueues[newPriority].insertAtTail(ride);
    }
  }

  getAllActiveRides() {
    let activeRides = [];

    activeRides = activeRides.concat(this.priorityQueues.VIP.toArray());
    activeRides = activeRides.concat(this.priorityQueues.emergency.toArray());
    activeRides = activeRides.concat(this.priorityQueues.regular.toArray());

    return activeRides;
  }

  rideComparator(driverLocation) {
    const priorityRank = { VIP: 0, emergency: 1, regular: 2 };

    const compareFn = (a, b) => {
      if (priorityRank[a.priority] !== priorityRank[b.priority]) {
        return priorityRank[a.priority] - priorityRank[b.priority];
      }

      const distA = this.haversineDistance(
        driverLocation.lat,
        driverLocation.lon,
        a.latitude,
        a.longitude
      );
      const distB = this.haversineDistance(
        driverLocation.lat,
        driverLocation.lon,
        b.latitude,
        b.longitude
      );
      if (distA !== distB) {
        return distA - distB;
      }

      return b.waitTime - a.waitTime;
    };

    const allRides = this.getAllActiveRides();

    const sortedRides = this.sorting.mergeSort(allRides, compareFn);
    return sortedRides;
  }

  updateWaitTimes() {
    const now = Date.now();
    this.rides.forEach((ride) => {
      ride.waitTime = Math.floor((now - ride.timestamp) / 60000);
    });
  }

  updateRidePriority(ride) {
    if (ride.priority === "regular" && ride.waitTime >= 5) {
      this.changePriority(ride, "emergency");
    } else if (ride.priority === "emergency" && ride.waitTime >= 8) {
      this.changePriority(ride, "VIP");
    }
  }

  checkExpirations() {
    const now = Date.now();
    while (this.expirationHeap.size() > 0) {
      const top = this.expirationHeap.peek();

      if (top.expirationTime <= now) {
        this.expirationHeap.pop();
        if (this.rides.has(top.rideId)) {
          const ride = this.rides.get(top.rideId);
          this.removeRide(ride);
        }
      } else {
        break;
      }
    }
  }

  assignRideToDriver(driverLocation) {
    this.checkExpirations();

    this.updateWaitTimes();

    this.rides.forEach((ride) => {
      this.updateRidePriority(ride);
    });

    const sortedRides = this.rideComparator(driverLocation);
    if (sortedRides.length === 0) {
      return null;
    }

    const bestRide = sortedRides[0];
    this.removeRide(bestRide);
    return bestRide;
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