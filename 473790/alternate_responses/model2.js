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
    if (!node) return;
    
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
    if (!node) return;
    
    node.prev = this.tail;
    node.next = null;
    
    if (this.tail) {
      this.tail.next = node;
    }
    
    this.tail = node;
    
    if (!this.head) {
      this.head = node;
    }
  }

  remove(node) {
    if (!node) return;
    
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
    
    node.next = node.prev = null;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
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
    this.defaultExpiration = 10; // 10 minutes
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  addRide(ride) {
    this.rides.set(ride.id, ride);
    this.priorityQueues[ride.priority].insertAtFront(ride);
    this.trie.insert(ride.passengerName, ride);
    
    const expirationTime = Date.now() + this.defaultExpiration * 60 * 1000;
    this.expirationHeap.push({ rideId: ride.id, expirationTime });
  }

  removeRide(ride) {
    this.rides.delete(ride.id);
    this.priorityQueues[ride.priority].remove(ride);
  }

  changePriority(ride, newPriority) {
    if (ride.priority === newPriority) return;
    
    this.priorityQueues[ride.priority].remove(ride);
    ride.priority = newPriority;
    this.priorityQueues[newPriority].insertAtFront(ride);
  }

  getAllActiveRides() {
    return [...this.rides.values()];
  }

  rideComparator(driverLocation) {
    const priorityRank = { VIP: 0, emergency: 1, regular: 2 };
    
    return (a, b) => {
      if (a.priority !== b.priority) {
        return priorityRank[a.priority] - priorityRank[b.priority];
      }
      
      const distA = this.haversineDistance(
        driverLocation.latitude, 
        driverLocation.longitude,
        a.latitude,
        a.longitude
      );
      
      const distB = this.haversineDistance(
        driverLocation.latitude,
        driverLocation.longitude,
        b.latitude,
        b.longitude
      );
      
      if (Math.abs(distA - distB) > 0.1) {
        return distA - distB;
      }
      
      return b.waitTime - a.waitTime;
    };
  }

  updateWaitTimes() {
    const now = Date.now();
    this.rides.forEach((ride) => {
      ride.waitTime = Math.floor((now - ride.timestamp) / 60000);
      this.updateRidePriority(ride);
    });
  }

  updateRidePriority(ride) {
    if (ride.waitTime >= 15 && ride.priority === "regular") {
      this.changePriority(ride, "emergency");
    } else if (ride.waitTime >= 30 && ride.priority === "emergency") {
      this.changePriority(ride, "VIP");
    }
  }

  assignRideToDriver(driverLocation) {
    this.updateWaitTimes();
    this.checkExpirations();
    
    const activeRides = this.getAllActiveRides();
    if (activeRides.length === 0) return null;
    
    const sortedRides = this.sorting.mergeSort(
      activeRides,
      this.rideComparator(driverLocation)
    );
    
    const bestRide = sortedRides[0];
    this.removeRide(bestRide);
    return bestRide;
  }

  checkExpirations() {
    const now = Date.now();
    while (this.expirationHeap.size() > 0) {
      const top = this.expirationHeap.peek();
      if (top.expirationTime <= now) {
        this.expirationHeap.pop();
        const ride = this.rides.get(top.rideId);
        if (ride) {
          this.removeRide(ride);
        }
      } else {
        break;
      }
    }
  }
}

class Sorting {
  mergeSort(arr, comparator) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    return this.merge(
      this.mergeSort(left, comparator),
      this.mergeSort(right, comparator),
      comparator
    );
  }

  merge(left, right, comparator) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
      if (comparator(left[leftIndex], right[rightIndex]) <= 0) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
    
    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
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

  heapifyUp(i) {
    while (i > 0 && this.heap[this.parent(i)].expirationTime > this.heap[i].expirationTime) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  heapifyDown(i) {
    let minIndex = i;
    const left = this.left(i);
    const right = this.right(i);
    
    if (left < this.heap.length && this.heap[left].expirationTime < this.heap[minIndex].expirationTime) {
      minIndex = left;
    }
    
    if (right < this.heap.length && this.heap[right].expirationTime < this.heap[minIndex].expirationTime) {
      minIndex = right;
    }
    
    if (minIndex !== i) {
      this.swap(i, minIndex);
      this.heapifyDown(minIndex);
    }
  }

  push(item) {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const result = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return result;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
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
    name = name.toLowerCase();
    let node = this.root;
    
    for (const char of name) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      node.rides.push(ride);
    }
    
    node.isEndOfWord = true;
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

module.exports = {
  RideRequest,
  DoublyLinkedList,
  RideManager,
  Sorting,
  Trie,
  MinHeap,
};