class TicketBookingSystem {
    // availableTickets: for example, ["A1", "A2", "A3", "B1", "B2"]
    constructor(availableTickets) {
      this.availableTickets = availableTickets;
      this.reservedTickets = new Map();
      this.cart = [];
      this.cache = new Cache(2000);
    }
  
    reserveTickets(userId, ticketOrder) {
      if (
        !this.availableTickets.every((ticket) => ticketOrder.includes(ticket))
      ) {
        console.log(`Tickets ${ticketOrder.join(",")} are not available!`);
        return this;
      }
  
      this.cache.set(userId, ticketOrder);
      console.log(`Reserved ${numberOfTickets} tickets for user ${userId}.`);
  
      setTimeout(() => {
        if (this.cache.get(userId)) {
          this.releaseTickets(userId);
        }
      }, 2000);
  
      return this;
    }
  
    releaseTickets(userId) {
      const reserved = this.reservedTickets.get(userId);
      if (!reserved) {
        console.log(`No tickets to release for user ${userId}.`);
        return this;
      }
  
      this.availableTickets += reserved;
      this.reservedTickets.delete(userId);
      this.cache.set(userId, null);
      console.log(`Released ${reserved.join(",")} tickets for user ${userId}.`);
      return this;
    }
  
    checkout(userId) {
      const reserved = this.reservedTickets.get(userId);
      if (!reserved) {
        console.log(`No reserved tickets found for user ${userId}.`);
        return this;
      }
  
      this.cart.push({ userId, tickets: reserved });
      this.reservedTickets.delete(userId);
      this.cache.set(userId, null);
      console.log(`User ${userId} checked out with ${reserved} tickets.`);
      return this;
    }
  
    showAvailableTickets() {
      console.log(`Available tickets: ${this.availableTickets}`);
      return this;
    }
  
    showCart(userId) {
      console.log(`Cart:`, this.cart[userId]);
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
  
  module.exports = { TicketBookingSystem};