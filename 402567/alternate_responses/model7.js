class MovieRentingSystem {
    constructor(n, entries) {
        this.availableMovies = {};
        this.rentedMoviesHeap = new Heap((a, b) => {
            if (a[0] === b[0]) {
                if (a[1] === b[1]) {
                    return a[2] < b[2];
                } else {
                    return a[1] < b[1];
                }
            } else {
                return a[0] < b[0];
            }
        });
        this.moviePrices = {};
        this.rentedMoviesSet = new Set();
        this.returnedMoviesSet = new Set();
        this._init(entries);
    }

    _init(entries) {
        for (const [shop, movie, price] of entries) {
            if (!(movie in this.availableMovies)) {
                this.availableMovies[movie] = new Heap((a, b) => a[0] === b[0] ? a[1] < b[1] : a[0] < b[0]);
            }
            this.availableMovies[movie].insert([price, shop]);
            if (!(shop in this.moviePrices)) {
                this.moviePrices[shop] = {};
            }
            this.moviePrices[shop][movie] = price;
        }
    }

    search(movie) {
        const res = [];
        const temp = [];

        while (this.availableMovies[movie] && this.availableMovies[movie].size && res.length < 5) {
            const [price, shop] = this.availableMovies[movie].remove();
            const hash = movie + ',' + shop;
            if (this._isMovieAvailable(hash)) {
                res.push(shop);
            }
            temp.push([price, shop]);
        }

        this._restoreHeap(this.availableMovies[movie], temp);
        return res;
    }

    rent(shop, movie) {
        if (!this.moviePrices[shop] || !this.moviePrices[shop][movie]) {
            return;
        }

        const hash = movie + ',' + shop;

        if (this.rentedMoviesSet.has(hash) && this.returnedMoviesSet.has(hash)) {
            this.returnedMoviesSet.delete(hash);
        } else if (this.rentedMoviesSet.has(hash) && !this.returnedMoviesSet.has(hash)) {
            return;
        } else if (!this.rentedMoviesSet.has(hash) && !this.returnedMoviesSet.has(hash)) {
            this.rentedMoviesSet.add(hash);
            this.rentedMoviesHeap.insert([this.moviePrices[shop][movie], shop, movie]);
        }
    }

    returnMovie(shop, movie) {
        const hash = movie + ',' + shop;
        this.returnedMoviesSet.add(hash);
    }

    getRentedMovies() {
        const res = [];
        const temp = [];

        while (this.rentedMoviesHeap.size && res.length < 5) {
            const [price, shop, movie] = this.rentedMoviesHeap.remove();
            const hash = movie + ',' + shop;
            if (this._isMovieAvailable(hash)) {
                res.push([shop, movie]);
                temp.push([price, shop, movie]);
            } else {
                this._cleanLazyTags(hash);
            }
        }

        this._restoreHeap(this.rentedMoviesHeap, temp);
        return res;
    }

    _isMovieAvailable(hash) {
        return !this.rentedMoviesSet.has(hash) || (this.rentedMoviesSet.has(hash) && this.returnedMoviesSet.has(hash));
    }

    _cleanLazyTags(hash) {
        this.rentedMoviesSet.delete(hash);
        this.returnedMoviesSet.delete(hash);
    }

    _restoreHeap(heap, temp) {
        while (temp.length) {
            heap.insert(temp.pop());
        }
    }
}

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
        this.bubbleUp();
    }

    remove() {
        if (!this.size) return null;
        this.swap(1, this.heap.length - 1);
        const curr = this.heap.pop();
        this.size--;
        this.bubbleDown();
        return curr;
    }

    bubbleUp() {
        let cI = this.heap.length - 1;
        let pI = Math.floor(cI / 2);
        while (pI !== 0 && this.compare(this.heap[cI], this.heap[pI])) {
            this.swap(cI, pI);
            cI = pI;
            pI = Math.floor(pI / 2);
        }
    }

    bubbleDown() {
        let pI = 1;
        let c1I = 2 * pI;
        let c2I = c1I + 1;

        while (c1I <= this.heap.length - 1) {
            let swapI;
            if (c2I >= this.heap.length) {
                swapI = c1I;
            } else {
                swapI = this.compare(this.heap[c2I], this.heap[c1I])
                    ? c2I
                    : c1I;
            }

            if (this.compare(this.heap[swapI], this.heap[pI])) {
                this.swap(swapI, pI);
                pI = swapI;
                c1I = 2 * pI;
                c2I = c1I + 1;
            } else return;
        }
    }

    peek() {
        return this.heap[1];
    }
}

module.exports = { MovieRentingSystem };