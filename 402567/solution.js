class MovieRentingSystem {
    constructor(n, entries) {
        this.availableMovies = {}; 
        this.rentedMoviesHeap = new Heap((a, b) => 
            a[0] === b[0] ? (a[1] === b[1] ? a[2] < b[2] : a[1] < b[1]) : a[0] < b[0]
        ); 

        this.moviePrices = {};
        this.rentedMovies = new Set(); 

        this._initializeMovies(entries);
    }

    _initializeMovies(entries) {
        for (const [shop, movie, price] of entries) {
            if (!(movie in this.availableMovies)) {
                this.availableMovies[movie] = new Heap((a, b) => 
                    a[0] === b[0] ? a[1] < b[1] : a[0] < b[0]
                );
            }
            this.availableMovies[movie].insert([price, shop]);

            if (!(shop in this.moviePrices)) this.moviePrices[shop] = {};
            this.moviePrices[shop][movie] = price;
        }
    }

    search(movie) {
        if (!(movie in this.availableMovies)) return [];
        
        const result = [];
        const tempHeap = [];

        while (this.availableMovies[movie].size && result.length < 5) {
            const [price, shop] = this.availableMovies[movie].remove();
            if (!this.rentedMovies.has(`${movie},${shop}`)) {
                result.push(shop);
            }
            tempHeap.push([price, shop]);
        }

        this._restoreHeap(tempHeap, this.availableMovies[movie]);
        return result;
    }

    rent(shop, movie) {
        const key = `${movie},${shop}`;

        // Check if the shop or movie exists in moviePrices
        if (!this.moviePrices[shop] || !this.moviePrices[shop][movie]) {
            return; 
        }

        // Check if the movie is already rented
        if (this.rentedMovies.has(key)) {
            return; // Movie is already rented
        }

        // Add to rented movies
        this.rentedMovies.add(key);
        this.rentedMoviesHeap.insert([this.moviePrices[shop][movie], shop, movie]);

        // Remove from available movies heap
        const tempHeap = [];
        while (this.availableMovies[movie].size) {
            const [price, s] = this.availableMovies[movie].remove();
            if (s !== shop) tempHeap.push([price, s]);
        }
        this._restoreHeap(tempHeap, this.availableMovies[movie]);
    }

    returnMovie(shop, movie) {
        const key = `${movie},${shop}`;
        if (!this.rentedMovies.has(key)) return;

        this.rentedMovies.delete(key);

        // Add back to availableMovies
        if (!(movie in this.availableMovies)) {
            this.availableMovies[movie] = new Heap((a, b) => 
                a[0] === b[0] ? a[1] < b[1] : a[0] < b[0]
            );
        }
        this.availableMovies[movie].insert([this.moviePrices[shop][movie], shop]);
    }

    getRentedMovies() {
        const result = [];
        const tempHeap = [];

        while (this.rentedMoviesHeap.size && result.length < 5) {
            const [price, shop, movie] = this.rentedMoviesHeap.remove();
            const key = `${movie},${shop}`;

            if (this.rentedMovies.has(key)) {
                result.push([shop, movie]);
                tempHeap.push([price, shop, movie]);
            }
        }

        this._restoreHeap(tempHeap, this.rentedMoviesHeap);
        return result;
    }

    _restoreHeap(tempHeap, originalHeap) {
        while (tempHeap.length) {
            originalHeap.insert(tempHeap.pop());
        }
    }
}

// MinHeap implementation
class Heap {
    constructor(compare) {
        this.heap = [null];
        this.size = 0;
        this.compare = compare;
    }

    swap(i1, i2) {
        [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
    }

    insert(el) {
        this.heap.push(el);
        this.size++;
        this._bubbleUp();
    }

    remove() {
        if (!this.size) return null;
        this.swap(1, this.heap.length - 1);
        const removedElement = this.heap.pop();
        this.size--;
        this._bubbleDown();
        return removedElement;
    }

    peek() {
        return this.heap[1];
    }

    _bubbleUp() {
        let idx = this.heap.length - 1;
        let parentIdx = Math.floor(idx / 2);

        while (parentIdx !== 0 && this.compare(this.heap[idx], this.heap[parentIdx])) {
            this.swap(idx, parentIdx);
            idx = parentIdx;
            parentIdx = Math.floor(idx / 2);
        }
    }

    _bubbleDown() {
        let idx = 1;
        let leftChildIdx = 2 * idx;
        let rightChildIdx = leftChildIdx + 1;

        while (leftChildIdx < this.heap.length) {
            let swapIdx = (rightChildIdx < this.heap.length && this.compare(this.heap[rightChildIdx], this.heap[leftChildIdx]))
                ? rightChildIdx : leftChildIdx;

            if (this.compare(this.heap[swapIdx], this.heap[idx])) {
                this.swap(swapIdx, idx);
                idx = swapIdx;
                leftChildIdx = 2 * idx;
                rightChildIdx = leftChildIdx + 1;
            } else {
                return;
            }
        }
    }
}

module.exports = { MovieRentingSystem };