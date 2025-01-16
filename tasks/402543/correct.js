class TicketBookingSystem {
    constructor(availableTickets, expiryMs) {
      if (
        !Array.isArray(availableTickets) ||
        !availableTickets.every(
          (ticket) => typeof ticket === "string" && ticket.length > 0
        ) ||
        typeof expiryMs !== "number" ||
        expiryMs <= 0
      ) {
        throw new Error("Invalid Input");
      }
  
      const updateAvailabelTickets = (tickets) => {
        this.availableTickets.push(...tickets);
      };
  
      this.availableTickets = [...availableTickets];
      this.cart = new Map();
      this.reservedTickets = new Cache(expiryMs, updateAvailabelTickets);
    }
  
    reserveTickets(userId, ticketOrder) {
      if (
        typeof userId !== "string" ||
        userId.length === 0 ||
        !Array.isArray(ticketOrder) ||
        !ticketOrder.every(
          (ticket) => typeof ticket === "string" && ticket.length > 0
        )
      ) {
        throw new Error("Invalid Input");
      }
  
      const unavailableTickets = ticketOrder.filter(
        (ticket) => !this.availableTickets.includes(ticket)
      );
  
      if (unavailableTickets.length > 0) {
        console.log(`Tickets ${unavailableTickets.join(",")} are not available!`);
        return this;
      }
  
      // Remove from available tickets
      this.availableTickets = this.availableTickets.filter(
        (ticket) => !ticketOrder.includes(ticket)
      );
  
      this.reservedTickets.set(userId, ticketOrder);
  
      console.log(
        `Reserved ${ticketOrder.join(",")} tickets for user ${userId}.`
      );
      return this;
    }
  
    releaseTickets(userId) {
      if (typeof userId !== "string" || userId.length === 0) {
        throw new Error("Invalid Input");
      }
  
      const reserved = this.reservedTickets.get(userId);
      if (!reserved) {
        console.log(`No tickets to release for user ${userId}.`);
        return this;
      }
  
      this.availableTickets.push(...reserved);
      this.reservedTickets.delete(userId);
      console.log(`Released ${reserved.join(",")} tickets for user ${userId}.`);
      return this;
    }
  
    checkout(userId) {
      if (typeof userId !== "string" || userId.length === 0) {
        throw new Error("Invalid Input");
      }
  
      const reserved = this.reservedTickets.get(userId);
      if (!reserved) {
        console.log(`No reserved tickets found for user ${userId}.`);
        return this;
      }
  
      this.cart.set(userId, reserved);
      this.reservedTickets.delete(userId);
      console.log(
        `User ${userId} checked out with ${reserved.join(",")} tickets.`
      );
      return this;
    }
  
    showAvailableTickets() {
      console.log(`Available tickets: ${this.availableTickets.join(",")}`);
      return this;
    }
  
    showCart(userId) {
      if (typeof userId !== "string" || userId.length === 0) {
        throw new Error("Invalid Input");
      }
  
      const userCart = this.cart.get(userId);
      console.log(`Cart: ${userCart ? userCart.join(",") : ""}`);
      return this;
    }
  }
  
  class Cache {
    constructor(expiryMs, updateAvailabelTickets) {
      this.store = new Map();
      this.expiryMs = expiryMs;
      this.updateAvailabelTickets = updateAvailabelTickets;
    }
  
    set(key, value) {
      const timeoutId = setTimeout(() => {
        this.updateAvailabelTickets(this.get(key));
        this.store.delete(key);
      }, this.expiryMs);
      const existed = this.store.has(key);
      if (existed) {
        clearTimeout(this.store.get(key).timeoutId);
      }
      const previousReservations = existed ? this.store.get(key).value : [];
      this.store.set(key, {
        value: [...previousReservations, ...value],
        timeoutId,
      });
      return this;
    }
  
    get(key) {
      const entry = this.store.get(key);
      if (entry) {
        return entry.value;
      }
      return null;
    }
  
    delete(key) {
      const entry = this.store.get(key);
      if (entry) {
        clearTimeout(entry.timeoutId);
        this.store.delete(key);
      }
      return this;
    }
  }
  
  module.exports = { TicketBookingSystem };