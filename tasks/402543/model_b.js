class TicketBookingSystem {
    constructor(availableTickets, expiryMs) {
      if (!Array.isArray(availableTickets) || 
          !availableTickets.every(ticket => typeof ticket === 'string' && ticket.length > 0) ||
          typeof expiryMs !== 'number' || expiryMs <= 0) {
        throw new Error('Invalid Input');
      }
  
      this.availableTickets = [...availableTickets];
      this.reservedTickets = new Map();
      this.cart = new Map();
      this.cache = new Cache(expiryMs);
    }
  
    reserveTickets(userId, ticketOrder) {
      if (typeof userId !== 'string' || userId.length === 0 ||
          !Array.isArray(ticketOrder) || 
          !ticketOrder.every(ticket => typeof ticket === 'string' && ticket.length > 0)) {
        throw new Error('Invalid Input');
      }
  
      const unavailableTickets = ticketOrder.filter(
        ticket => !this.availableTickets.includes(ticket)
      );
  
      if (unavailableTickets.length > 0) {
        console.log(`Tickets ${unavailableTickets.join(',')} are not available!`);
        return this;
      }
  
      const currentReserved = this.reservedTickets.get(userId) || [];
      const newReservation = [...new Set([...currentReserved, ...ticketOrder])];
      
      this.reservedTickets.set(userId, newReservation);
      this.availableTickets = this.availableTickets.filter(
        ticket => !newReservation.includes(ticket)
      );
  
      this.cache.set(userId, newReservation);
      console.log(`Reserved ${ticketOrder.join(',')} tickets for user ${userId}.`);
  
      setTimeout(() => {
        if (this.cache.get(userId)) {
          this.releaseTickets(userId);
        }
      }, this.cache.expiryMs);
  
      return this;
    }
  
    releaseTickets(userId) {
      if (typeof userId !== 'string' || userId.length === 0) {
        throw new Error('Invalid Input');
      }
  
      const reserved = this.reservedTickets.get(userId);
      if (!reserved) {
        console.log(`No tickets to release for user ${userId}.`);
        return this;
      }
  
      this.availableTickets.push(...reserved);
      this.reservedTickets.delete(userId);
      this.cache.set(userId, null);
      console.log(`Released ${reserved.join(',')} tickets for user ${userId}.`);
      return this;
    }
  
    checkout(userId) {
      if (typeof userId !== 'string' || userId.length === 0) {
        throw new Error('Invalid Input');
      }
  
      const reserved = this.reservedTickets.get(userId);
      if (!reserved) {
        console.log(`No reserved tickets found for user ${userId}.`);
        return this;
      }
  
      this.cart.set(userId, reserved);
      this.reservedTickets.delete(userId);
      this.cache.set(userId, null);
      console.log(`User ${userId} checked out with ${reserved.join(',')} tickets.`);
      return this;
    }
  
    showAvailableTickets() {
      console.log(`Available tickets: ${this.availableTickets.join(',')}`);
      return this;
    }
  
    showCart(userId) {
      if (typeof userId !== 'string' || userId.length === 0) {
        throw new Error('Invalid Input');
      }
  
      const userCart = this.cart.get(userId);
      console.log(`Cart: ${userCart ? userCart.join(',') : ''}`);
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
  }
  
  module.exports = { TicketBookingSystem };