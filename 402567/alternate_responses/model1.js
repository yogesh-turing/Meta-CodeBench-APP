class MovieRentingSystem {
    constructor(n, entries) {
        this.available = {};
        this.rented = new Heap((a, b) => {
            if (a[0] === b[0]) {
                if (a[1] === b[1]) {
                    return a[2] < b[2]
                } else {
                    return a[1] < b[1]
                }
            } else {
                return a[0] < b[0]
            }
        })
        this.prices = {}
        this.rentedMoviesSet = new Set();
        this.returnedMoviesSet = new Set();

        this._init(entries);
    }

    _init(entries) {
        for (const [shop, movie, price] of entries) {
            if (!(movie in this.available)) {
                this.available[movie] = new Heap((a, b) => a[0] === b[0] ? a[1] < b[1] : a[0] < b[0]);
            }
            this.available[movie].insert([price, shop]);
            if (!(shop in this.prices)) this.prices[shop] = {};
            this.prices[shop][movie] = price;
        }
    }

    _isMovieAvailable(hash) {
        return !this.rentedMoviesSet.has(hash) || 
               (this.rentedMoviesSet.has(hash) && this.returnedMoviesSet.has(hash));
    }

    _cleanLazyTags(hash) {
        if (this.returnedMoviesSet.has(hash) && this.rentedMoviesSet.has(hash)) {
            this.returnedMoviesSet.delete(hash);
            this.rentedMoviesSet.delete(hash);
        }
    }

    _restoreHeap(heap, temp) {
        while (temp.length) {
            heap.insert(temp.pop());
        }
    }

    search(movie) {
        if (!(movie in this.available)) return [];
        
        const res = [];
        const temp = [];

        while (this.available[movie] && this.available[movie].size && res.length < 5) {
            const [price, shop] = this.available[movie].remove();
            const hash = movie + ',' + shop;
            if (this._isMovieAvailable(hash)) {
                res.push(shop);
            }
            temp.push([price, shop]);
        }

        this._restoreHeap(this.available[movie], temp);
        return res;
    }

    rent(shop, movie) {
        if (!(shop in this.prices) || !(movie in this.prices[shop])) return;
        
        const hash = movie + ',' + shop;

        if (this.rentedMoviesSet.has(hash) && this.returnedMoviesSet.has(hash)) {
            this.returnedMoviesSet.delete(hash);
        } else if (this.rentedMoviesSet.has(hash) && !this.returnedMoviesSet.has(hash)) {
            return;
        } else if (!this.rentedMoviesSet.has(hash) && !this.returnedMoviesSet.has(hash)) {
            this.rentedMoviesSet.add(hash);
            this.rented.insert([this.prices[shop][movie], shop, movie]);
        }
    }

    returnMovie(shop, movie) {
        if (!(shop in this.prices) || !(movie in this.prices[shop])) return;
        
        const hash = movie + ',' + shop;
        this.returnedMoviesSet.add(hash);
    }

    getRentedMovies() {
        const res = [];
        const temp = [];

        while (this.rented.size && res.length < 5) {
            const [price, shop, movie] = this.rented.remove();
            const hash = movie + ',' + shop;
            
            if (!this.returnedMoviesSet.has(hash) && this.rentedMoviesSet.has(hash)) {
                res.push([shop, movie]);
                temp.push([price, shop, movie]);
            } else {
                this._cleanLazyTags(hash);
            }
        }

        this._restoreHeap(this.rented, temp);
        return res;
    }
}

module.exports = { MovieRentingSystem };