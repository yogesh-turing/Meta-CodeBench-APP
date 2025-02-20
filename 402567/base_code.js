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
        this.prices = {} 
  
        this.rentedSet = new Set(); 
        this.returnedSet = new Set(); 
        
        this._init(entries);
    }
    
    _init(entries){
      for (const [shop, movie, price] of entries) {
            if (!(movie in this.available)) this.available[movie] = new Heap((a,b)=>a[0]===b[0]? a[1]<b[1]:a[0]<b[0]);
          this.available[movie].insert([price,shop]);
          if (!(shop in this.prices)) this.prices[shop]={};
          this.prices[shop][movie]=price;
      }
    }
    
    search(movie){
        const res = [];
        const temp = [];
		
        while (this.available[movie] && this.available[movie].size && res.length<5) {
            const [price, shop] = this.available[movie].remove();
            const hash = movie+','+shop;
            if (!this.rentedSet.has(hash) || (this.rentedSet.has(hash) && this.returnedSet.has(hash))) {
                res.push(shop);
            } 
            temp.push([price,shop]);
        }
		
        while (temp.length) {
            this.available[movie].insert(temp.pop());
        }
        return res;
    }
    
    
    rent(shop, movie){
        const hash = movie+','+shop;
    
        if (this.rentedSet.has(hash) && this.returnedSet.has(hash)) {
            this.returnedSet.delete(hash);
        } else if (this.rentedSet.has(hash) && !this.returnedSet.has(hash)) {
            return;
        } else if (!this.rentedSet.has(hash) && !this.returnedSet.has(hash)) {
            this.rentedSet.add(hash);
            this.rented.insert([this.prices[shop][movie],shop, movie]);
        }
        
    }
    
    drop(shop, movie){
        const hash = movie+','+shop;
        this.returnedSet.add(hash);
    }
    
    report(){
        const res = [];
        const temp = [];
		
        while (this.rented.size && res.length<5) {
            const [price, shop, movie] = this.rented.remove();
            const hash = movie+','+shop;
            if (!this.returnedSet.has(hash) && this.rentedSet.has(hash)) {
                res.push([shop,movie]);
                temp.push([price, shop, movie]);
            } else if (this.returnedSet.has(hash) && this.rentedSet.has(hash)){
                this.returnedSet.delete(hash);
                this.rentedSet.delete(hash);
            }
        }
		
        while (temp.length) {
            this.rented.insert(temp.pop());
        }
		
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