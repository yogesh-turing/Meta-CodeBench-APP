const {
  RideRequest,
  DoublyLinkedList,
  RideManager,
  Sorting,
  Trie,
  MinHeap,
} = require("./solution");

describe("RideRequest", () => {
  test("should initialize the instance correctly", () => {
    const ride = new RideRequest(1, "Alice", 40.7128, -74.006, "VIP");
    expect(ride.id).toBe(1);
    expect(ride.passengerName).toBe("Alice");
    expect(ride.latitude).toBe(40.7128);
    expect(ride.longitude).toBe(-74.006);
    expect(ride.priority).toBe("VIP");
    expect(typeof ride.timestamp).toBe("number");
    expect(ride.waitTime).toBe(0);
    expect(ride.next).toBeNull();
    expect(ride.prev).toBeNull();
  });
});

describe("DoublyLinkedList", () => {
  test("should insert at front on empty list", () => {
    const list = new DoublyLinkedList();
    const node = new RideRequest(2, "Bob", 34.0522, -118.2437);
    list.insertAtFront(node);
    expect(list.head).toBe(node);
    expect(list.tail).toBe(node);
    expect(node.next).toBeNull();
    expect(node.prev).toBeNull();
  });

  test("should insert at front on non-empty list", () => {
    const list = new DoublyLinkedList();
    const node1 = new RideRequest(3, "Carol", 37.7749, -122.4194);
    const node2 = new RideRequest(4, "Dave", 47.6062, -122.3321);
    list.insertAtFront(node1);
    list.insertAtFront(node2);
    expect(list.head).toBe(node2);
    expect(list.head.next).toBe(node1);
    expect(node1.prev).toBe(node2);
    expect(list.tail).toBe(node1);
  });

  test("should insert at tail on empty list", () => {
    const list = new DoublyLinkedList();
    const node = new RideRequest(5, "Eve", 51.5074, -0.1278);
    list.insertAtTail(node);
    expect(list.head).toBe(node);
    expect(list.tail).toBe(node);
    expect(node.next).toBeNull();
    expect(node.prev).toBeNull();
  });

  test("should insert at tail on non-empty list", () => {
    const list = new DoublyLinkedList();
    const node1 = new RideRequest(6, "Frank", 48.8566, 2.3522);
    const node2 = new RideRequest(7, "Grace", 35.6895, 139.6917);
    list.insertAtTail(node1);
    list.insertAtTail(node2);
    expect(list.head).toBe(node1);
    expect(list.tail).toBe(node2);
    expect(node1.next).toBe(node2);
    expect(node2.prev).toBe(node1);
  });

  test("should remove nodes correctly", () => {
    const list = new DoublyLinkedList();
    const node1 = new RideRequest(8, "Heidi", 55.7558, 37.6173);
    const node2 = new RideRequest(9, "Ivan", 41.9028, 12.4964);
    const node3 = new RideRequest(10, "Judy", -33.8688, 151.2093);
    list.insertAtTail(node1);
    list.insertAtTail(node2);
    list.insertAtTail(node3);
    list.remove(node2);
    expect(node1.next).toBe(node3);
    expect(node3.prev).toBe(node1);
    list.remove(node1);
    expect(list.head).toBe(node3);
    expect(node3.prev).toBeNull();
    list.remove(node3);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
  });

  test("should return nodes in order with toArray", () => {
    const list = new DoublyLinkedList();
    const node1 = new RideRequest(11, "Ken", 19.4326, -99.1332);
    const node2 = new RideRequest(12, "Leo", 39.9042, 116.4074);
    list.insertAtTail(node1);
    list.insertAtTail(node2);
    const arr = list.toArray();
    expect(arr).toEqual([node1, node2]);
  });
});

describe("Sorting", () => {
  test("should sort numbers correctly using mergeSort", () => {
    const sorting = new Sorting();
    const arr = [5, 3, 8, 1, 2];
    const comparator = (a, b) => a - b;
    const sorted = sorting.mergeSort(arr, comparator);
    expect(sorted).toEqual([1, 2, 3, 5, 8]);
  });

  test("should sort objects correctly using mergeSort", () => {
    const sorting = new Sorting();
    const arr = [{ x: 10 }, { x: 5 }, { x: 15 }, { x: 7 }];
    const comparator = (a, b) => a.x - b.x;
    const sorted = sorting.mergeSort(arr, comparator);
    expect(sorted).toEqual([{ x: 5 }, { x: 7 }, { x: 10 }, { x: 15 }]);
  });
});

describe("Trie", () => {
  test("should insert and search rides case-insensitively", () => {
    const trie = new Trie();
    const ride = new RideRequest(13, "Alice", 0, 0);
    trie.insert("Alice", ride);
    const results = trie.search("ali");
    expect(results).toContain(ride);
  });

  test("should return empty array when no rides match in search", () => {
    const trie = new Trie();
    const ride = new RideRequest(14, "Bob", 0, 0);
    trie.insert("Bob", ride);
    const results = trie.search("z");
    expect(results).toEqual([]);
  });

  test("should reuse trie nodes for duplicate insertions", () => {
    const trie = new Trie();
    const ride1 = new RideRequest(31, "Alice", 0, 0);
    const ride2 = new RideRequest(32, "Alice", 0, 0);
    trie.insert("Alice", ride1);
    let node = trie.root;
    for (const char of "alice") {
      node = node.children[char];
    }
    const initialLength = node.rides.length;
    trie.insert("Alice", ride2);
    expect(node.rides.length).toBe(initialLength + 1);
  });
});

describe("MinHeap", () => {
  test("should pop items in ascending expiration order", () => {
    const heap = new MinHeap();
    heap.push({ rideId: 1, expirationTime: 3000 });
    heap.push({ rideId: 2, expirationTime: 1000 });
    heap.push({ rideId: 3, expirationTime: 2000 });
    expect(heap.pop().rideId).toBe(2);
    expect(heap.pop().rideId).toBe(3);
    expect(heap.pop().rideId).toBe(1);
  });

  test("should peek and return the smallest expirationTime item", () => {
    const heap = new MinHeap();
    heap.push({ rideId: 1, expirationTime: 4000 });
    heap.push({ rideId: 2, expirationTime: 1500 });
    expect(heap.peek().rideId).toBe(2);
  });

  test("should return correct size of the heap", () => {
    const heap = new MinHeap();
    expect(heap.size()).toBe(0);
    heap.push({ rideId: 1, expirationTime: 4000 });
    heap.push({ rideId: 2, expirationTime: 1500 });
    expect(heap.size()).toBe(2);
  });

  test("should return null when popping from an empty heap", () => {
    const heap = new MinHeap();
    expect(heap.pop()).toBeNull();
  });

  test("should swap with right child during heapifyDown when right is smaller", () => {
    const heap = new MinHeap();
    heap.heap = [
      { rideId: 1, expirationTime: 3000 },
      { rideId: 2, expirationTime: 4000 },
      { rideId: 3, expirationTime: 1000 },
    ];
    heap.heapifyDown(0);
    expect(heap.heap[0].rideId).toBe(3);
    expect(heap.heap[2].rideId).toBe(1);
  });

  test("should return null when peeking into an empty heap", () => {
    const heap = new MinHeap();
    expect(heap.peek()).toBeNull();
  });

  test("should trigger left branch in heapifyDown when left child is smaller", () => {
    const heap = new MinHeap();
    heap.heap = [
      { rideId: 1, expirationTime: 3000 },
      { rideId: 2, expirationTime: 2000 },
      { rideId: 3, expirationTime: 4000 },
    ];
    heap.heapifyDown(0);
    expect(heap.heap[0].rideId).toBe(2);
  });
});

describe("RideManager", () => {
  test("should return 0 distance for identical coordinates", () => {
    const manager = new RideManager();
    const distance = manager.haversineDistance(40, -74, 40, -74);
    expect(distance).toBeCloseTo(0);
  });

  test("should add ride to Map, proper queue, Trie, and heap", () => {
    const manager = new RideManager();
    const ride = new RideRequest(15, "Mia", 10, 10, "regular");
    manager.addRide(ride);
    expect(manager.rides.has(15)).toBe(true);
    const regularQueue = manager.priorityQueues.regular.toArray();
    expect(regularQueue).toContain(ride);
    const trieResults = manager.trie.search("mia");
    expect(trieResults).toContain(ride);
  });

  test("should remove ride from Map and its priority queue", () => {
    const manager = new RideManager();
    const ride = new RideRequest(16, "Nina", 20, 20, "emergency");
    manager.addRide(ride);
    manager.removeRide(ride);
    expect(manager.rides.has(16)).toBe(false);
    const emergencyQueue = manager.priorityQueues.emergency.toArray();
    expect(emergencyQueue).not.toContain(ride);
  });

  test("should move ride between queues when priority changes", () => {
    const manager = new RideManager();
    const ride = new RideRequest(17, "Oscar", 30, 30, "regular");
    manager.addRide(ride);
    manager.changePriority(ride, "VIP");
    expect(ride.priority).toBe("VIP");
    const vipQueue = manager.priorityQueues.VIP.toArray();
    expect(vipQueue).toContain(ride);
    const regularQueue = manager.priorityQueues.regular.toArray();
    expect(regularQueue).not.toContain(ride);
  });

  test("should return all active rides across priority queues", () => {
    const manager = new RideManager();
    const ride1 = new RideRequest(18, "Paul", 0, 0, "VIP");
    const ride2 = new RideRequest(19, "Quinn", 0, 0, "emergency");
    const ride3 = new RideRequest(20, "Rita", 0, 0, "regular");
    manager.addRide(ride1);
    manager.addRide(ride2);
    manager.addRide(ride3);
    const activeRides = manager.getAllActiveRides();
    expect(activeRides).toEqual(expect.arrayContaining([ride1, ride2, ride3]));
  });

  test("should sort rides based on priority, distance, and waitTime", () => {
    const manager = new RideManager();
    const rideVIP = new RideRequest(21, "Sam", 10, 10, "VIP");
    const rideEmergency = new RideRequest(22, "Tom", 11, 11, "emergency");
    const rideRegular = new RideRequest(23, "Uma", 12, 12, "regular");
    rideVIP.waitTime = 2;
    rideEmergency.waitTime = 5;
    rideRegular.waitTime = 10;
    manager.addRide(rideRegular);
    manager.addRide(rideEmergency);
    manager.addRide(rideVIP);
    const sorted = manager.rideComparator({ lat: 10, lon: 10 });
    expect(sorted[0]).toBe(rideVIP);
    expect(sorted[1]).toBe(rideEmergency);
    expect(sorted[2]).toBe(rideRegular);
  });

  test("should update wait times based on current time", () => {
    const manager = new RideManager();
    const ride = new RideRequest(24, "Vera", 0, 0, "regular");
    ride.timestamp = Date.now() - 3 * 60000;
    manager.addRide(ride);
    manager.updateWaitTimes();
    const updatedRide = manager.rides.get(24);
    expect(updatedRide.waitTime).toBeGreaterThanOrEqual(3);
  });

  test("should upgrade ride priority based on wait time", () => {
    const manager = new RideManager();
    const ride1 = new RideRequest(25, "Wendy", 0, 0, "regular");
    ride1.waitTime = 100;
    manager.addRide(ride1);
    manager.updateRidePriority(ride1);
    expect(ride1.priority).toBe("emergency");
    const ride2 = new RideRequest(26, "Xander", 0, 0, "emergency");
    ride2.waitTime = 100;
    manager.addRide(ride2);
    manager.updateRidePriority(ride2);
    expect(ride2.priority).toBe("VIP");
  });

  test("should remove expired rides", () => {
    jest.useFakeTimers("modern");
    const manager = new RideManager();
    const ride = new RideRequest(27, "Yara", 0, 0, "regular");
    ride.timestamp = Date.now() - 11 * 60000;
    manager.addRide(ride);
    jest.advanceTimersByTime(1);
    manager.checkExpirations();
    expect(manager.rides.has(27)).toBe(false);
    jest.useRealTimers();
  });

  test("should assign and remove the best ride", () => {
    const manager = new RideManager();
    const ride1 = new RideRequest(28, "Zack", 10, 10, "regular");
    const ride2 = new RideRequest(29, "Amy", 11, 11, "VIP");
    const ride3 = new RideRequest(30, "Brian", 12, 12, "emergency");
    ride1.waitTime = 1;
    ride2.waitTime = 2;
    ride3.waitTime = 3;
    manager.addRide(ride1);
    manager.addRide(ride2);
    manager.addRide(ride3);
    const assigned = manager.assignRideToDriver({ lat: 10, lon: 10 });
    expect(assigned).toBe(ride2);
    expect(manager.rides.has(29)).toBe(false);
  });

  test("should handle if ride to remove is not found", () => {
    const manager = new RideManager();
    const ride = new RideRequest(33, "NotInSystem", 0, 0, "regular");
    expect(() => manager.removeRide(ride)).not.toThrow();
  });

  test("should not change priority if new priority is same", () => {
    const manager = new RideManager();
    const ride = new RideRequest(34, "SamePriority", 0, 0, "regular");
    manager.addRide(ride);
    const originalQueue = manager.priorityQueues.regular.toArray();
    manager.changePriority(ride, "regular");
    const newQueue = manager.priorityQueues.regular.toArray();
    expect(newQueue).toEqual(originalQueue);
  });

  test("should compare waitTime when distances are equal", () => {
    const manager = new RideManager();
    const ride1 = new RideRequest(35, "WaitOne", 10, 10, "regular");
    const ride2 = new RideRequest(36, "WaitTwo", 10, 10, "regular");
    ride1.waitTime = 2;
    ride2.waitTime = 5;
    manager.addRide(ride1);
    manager.addRide(ride2);
    const sorted = manager.rideComparator({ lat: 10, lon: 10 });
    expect(sorted[0]).toBe(ride2);
    expect(sorted[1]).toBe(ride1);
  });

  test("should compare distance when waitTime are equal", () => {
    const manager = new RideManager();
    const ride1 = new RideRequest(37, "DistOne", 10, 10, "regular");
    const ride2 = new RideRequest(38, "DistTwo", 20, 20, "regular");
    ride1.waitTime = 3;
    ride2.waitTime = 3;
    manager.addRide(ride1);
    manager.addRide(ride2);
    const sorted = manager.rideComparator({ lat: 0, lon: 0 });
    expect(sorted[0]).toBe(ride1);
  });

  test("should handle if ride not found in Map in the checkExpirations", () => {
    jest.useFakeTimers("modern");
    const manager = new RideManager();
    manager.expirationHeap.push({
      rideId: 999,
      expirationTime: Date.now() - 1000,
    });
    manager.checkExpirations();
    expect(manager.expirationHeap.size()).toBe(0);
    jest.useRealTimers();
  });

  test("should return null when no active rides exist", () => {
    const manager = new RideManager();
    const assigned = manager.assignRideToDriver({ lat: 0, lon: 0 });
    expect(assigned).toBeNull();
  });
});