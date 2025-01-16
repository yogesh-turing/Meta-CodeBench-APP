class TicketBookingSystem {
    constructor(availableTickets, expiryMs) {
      if (!Array.isArray(availableTickets) || availableTickets.length === 0) {
        throw new Error("Invalid Input");
      }
      if (typeof expiryMs !== "number" || expiryMs <= 0) {
        throw new Error("Invalid Input");
      }
      this.availableTickets = availableTickets;
      this.expiryMs = expiryMs;
      this.reservedTickets = new Map();
      this.cart = new Map();
      this.cache = new Cache(expiryMs);
    }
  
    reserveTickets(userId, ticketOrder) {
      if (typeof userId !== "string" || userId.trim() === "") {
        throw new Error("Invalid Input");
      }
      if (!Array.isArray(ticketOrder) || ticketOrder.length === 0) {
        throw new Error("Invalid Input");
      }
      const unavailableTickets = ticketOrder.filter(
        (ticket) => !this.availableTickets.includes(ticket)
      );
      if (unavailableTickets.length > 0) {
        console.log(`Tickets ${unavailableTickets.join(",")} are not available!`);
        return this;
      }
      const existingReservedTickets = this.reservedTickets.get(userId) || [];
      const newReservedTickets = [...existingReservedTickets, ...ticketOrder];
      this.reservedTickets.set(userId, newReservedTickets);
      this.cache.set(userId, newReservedTickets);
      console.log(`Reserved ${ticketOrder.join(",")} tickets for user ${userId}.`);
      setTimeout(() => {
        if (this.cache.get(userId)) {
          this.releaseTickets(userId);
        }
      }, this.expiryMs);
      return this;
    }
  
    releaseTickets(userId) {
      if (typeof userId !== "string" || userId.trim() === "") {
        throw new Error("Invalid Input");
      }
      const reserved = this.reservedTickets.get(userId);
      if (!reserved) {
        console.log(`No tickets to release for user ${userId}.`);
        return this;
      }
      this.availableTickets = [...this.availableTickets, ...reserved];
      this.reservedTickets.delete(userId);
      this.cache.set(userId, null);
      console.log(`Released ${reserved.join(",")} tickets for user ${userId}.`);
      return this;
    }
  
    checkout(userId) {
      if (typeof userId !== "string" || userId.trim() === "") {
        throw new Error("Invalid Input");
      }
      const reserved = this.reservedTickets.get(userId);
      if (!reserved) {
        console.log(`No reserved tickets found for user ${userId}.`);
        return this;
      }
      this.cart.set(userId, reserved);
      this.reservedTickets.delete(userId);
      this.cache.set(userId, null);
      console.log(`User ${userId} checked out with ${reserved.join(",")} tickets.`);
      return this;
    }
  
    showAvailableTickets() {
      console.log(`Available tickets: ${this.availableTickets.join(",")}`);
      return this;
    }
  
    showCart(userId) {
      if (typeof userId !== "string" || userId.trim() === "") {
        throw new Error("Invalid Input");
      }
      const cart = this.cart.get(userId);
      if (!cart) {
        console.log(`No cart found for user ${userId}.`);
        return this;
      }
      console.log(`Cart: ${cart.join(",")}`);
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