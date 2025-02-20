class MovieRentingSystem {
    constructor(n, entries){
        this.available = {}; 
        this.rented = new Heap((a,b)=>
        {
            if (a[0]===b[0]) {
                if (a[1]===b[1]) {
                    return a[2]<b[2]
                } else {
                    return a[1]<b[1]
                } 
            } else {
                return a[0]<b[0]
            }
        }) 
        this.moviePrices = {} 
  
        this.rentedMoviesSet = new Set(); 
        this.returnedMoviesSet = new Set(); 
        
        this._init(entries);
    }
    
    _init(entries){
      for (const [shop, movie, price] of entries) {
            if (!(movie in this.available)) this.available[movie] = new Heap((a,b)=>a[0]===b[0]? a[1]<b[1]:a[0]<b[0]);
          this.available[movie].insert([price,shop]);
          if (!(shop in this.moviePrices)) this.moviePrices[shop]={};
          this.moviePrices[shop][movie]=price;
      }
    }
    
    _isMovieAvailable(movie, shop) {
        const hash = movie+','+shop;
        return !this.rentedMoviesSet.has(hash) || this.returnedMoviesSet.has(hash);
    }
    
    _cleanLazyTags() {
        for (const hash of this.returnedMoviesSet) {
            this.rentedMoviesSet.delete(hash);
        }
        this.returnedMoviesSet.clear();
    }
    
    _restoreHeap(heap, elements) {
        for (const el of elements) {
            heap.insert(el);
        }
    }
    
    search(movie){
        const res = [];
        const temp = [];
		
        if (!(movie in this.available)) return res;
        
        while (this.available[movie].size && res.length<5) {
            const [price, shop] = this.available[movie].remove();
            if (this._isMovieAvailable(movie, shop)) {
                res.push(shop);
            } 
            temp.push([price,shop]);
        }
		
        this._restoreHeap(this.available[movie], temp);
        return res;
    }
    
    rent(shop, movie){
        const hash = movie+','+shop;
        if (!(shop in this.moviePrices) || !(movie in this.moviePrices[shop])) return;
        
        if (this.rentedMoviesSet.has(hash) && this.returnedMoviesSet.has(hash)) {
            this.returnedMoviesSet.delete(hash);
        } else if (this.rentedMoviesSet.has(hash) && !this.returnedMoviesSet.has(hash)) {
            return;
        } else if (!this.rentedMoviesSet.has(hash) && !this.returnedMoviesSet.has(hash)) {
            this.rentedMoviesSet.add(hash);
            this.rented.insert([this.moviePrices[shop][movie],shop, movie]);
        }
        
    }
    
    returnMovie(shop, movie){
        const hash = movie+','+shop;
        this.returnedMoviesSet.add(hash);
    }
    
    getRentedMovies(){
        const res = [];
        const temp = [];
		
        while (this.rented.size && res.length<5) {
            const [price, shop, movie] = this.rented.remove();
            const hash = movie+','+shop;
            if (!this.returnedMoviesSet.has(hash) && this.rentedMoviesSet.has(hash)) {
                res.push([shop,movie]);
                temp.push([price, shop, movie]);
            } else if (this.returnedMoviesSet.has(hash) && this.rentedMoviesSet.has(hash)){
                this.returnedMoviesSet.delete(hash);
                this.rentedMoviesSet.delete(hash);
            }
        }
		
        this._restoreHeap(this.rented, temp);
		this._cleanLazyTags();
        return res;  
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
        return this.heap[1]
    }
}

module.exports = { MovieRentingSystem };