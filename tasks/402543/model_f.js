class TicketBookingSystem {
    // availableTickets: for example, ["A1", "A2", "A3", "B1", "B2"]
    constructor(availableTickets, expiryMs) {
      if (!Array.isArray(availableTickets) || !availableTickets.length) {
        throw new Error('Invalid Input');
      }
      if (typeof expiryMs !== 'number' || expiryMs <= 0) {
        throw new Error('Invalid Input');
      }
      this.availableTickets = availableTickets;
      this.reservedTickets = new Map();
      this.cart = new Map();
      this.cache = new Cache(expiryMs);
    }
  
    reserveTickets(userId, ticketOrder) {
      if (typeof userId !== 'string' || !userId) {
        throw new Error('Invalid Input');
      }
      if (!Array.isArray(ticketOrder) || !ticketOrder.length) {
        throw new Error('Invalid Input');
      }
      const unavailableTickets = ticketOrder.filter(ticket => !this.availableTickets.includes(ticket));
      if (unavailableTickets.length) {
        console.log(`Tickets ${unavailableTickets.join(',')} are not available!`);
        return this;
      }
  
      const existingReservedTickets = this.cache.get(userId);
      if (existingReservedTickets) {
        this.cache.delete(userId);
      }
      const reservedTickets = existingReservedTickets ? existingReservedTickets.concat(ticketOrder) : ticketOrder;
      this.cache.set(userId, reservedTickets);
      console.log(`Reserved ${reservedTickets.join(',')} tickets for user ${userId}.`);
  
      setTimeout(() => {
        if (this.cache.get(userId)) {
          this.releaseTickets(userId);
        }
      }, this.cache.expiryMs);
  
      return this;
    }
  
    releaseTickets(userId) {
      if (typeof userId !== 'string' || !userId) {
        throw new Error('Invalid Input');
      }
      const reserved = this.cache.get(userId);
      if (!reserved) {
        console.log(`No tickets to release for user ${userId}.`);
        return this;
      }
  
      this.availableTickets = this.availableTickets.concat(reserved);
      this.cache.delete(userId);
      console.log(`Released ${reserved.join(',')} tickets for user ${userId}.`);
      return this;
    }
  
    checkout(userId) {
      if (typeof userId !== 'string' || !userId) {
        throw new Error('Invalid Input');
      }
      const reserved = this.cache.get(userId);
      if (!reserved) {
        console.log(`No reserved tickets found for user ${userId}.`);
        return this;
      }
  
      if (!this.cart.has(userId)) {
        this.cart.set(userId, []);
      }
      this.cart.get(userId).push(...reserved);
      this.cache.delete(userId);
      console.log(`User ${userId} checked out with ${reserved.join(',')} tickets.`);
      return this;
    }
  
    showAvailableTickets() {
      console.log(`Available tickets: ${this.availableTickets.join(',')}`);
      return this;
    }
  
    showCart(userId) {
      if (typeof userId !== 'string' || !userId) {
        throw new Error('Invalid Input');
      }
      console.log(`Cart: ${this.cart.get(userId) ? this.cart.get(userId).join(',') : 'empty'}`);
      return this;
    }
  }
  
  class Cache {
    constructor(expiryMs) {
      this.store = new Map();
      this.expiryMs = expiryMs;
    }
  
    set(key, value) {
      const expiry = Date.now() + this.expiryMs;
      this.store.set(key, { value, expiry });
      return this;
    }
  
    get(key) {
      const entry = this.store.get(key);
      if (entry && entry.expiry > Date.now()) {
        return entry.value;
      }
      this.store.delete(key);
      return null;
    }
  
    delete(key) {
      this.store.delete(key);
    }
  }
  
  module.exports = { TicketBookingSystem };