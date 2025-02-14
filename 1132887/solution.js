const EventEmitter = require("events");

class LibrarySystem extends EventEmitter {
  constructor() {
    super();
    this.books = new Map();
    this.members = new Map();
  }

  // Add a new book to the library
  addBook(title, author, copies) {
    if (!title || !author || !copies || typeof copies !== "number" || copies <= 0) {
      throw new Error("Error encountered");
    }
    if (this.books.has(title)) {
      throw new Error("Error encountered");
    }
    const book = { title, author, copies };
    this.books.set(title, book);
    this.emit("bookAdded", book);
  }

  // Register a new member
  registerMember(name, id) {
    if (!name || !id || typeof id !== "number") {
      throw new Error("Error encountered");
    }
    if (this.members.has(id)) {
      throw new Error("Error encountered");
    }
    const member = { name, id };
    this.members.set(id, member);
    this.emit("memberRegistered", member);
  }

  // Issue a book to a member
  issueBook(title, memberId) {
    if (!title || !memberId || typeof memberId !== "number") {
      throw new Error("Error encountered");
    }
    const book = this.books.get(title);
    const member = this.members.get(memberId);

    if (!book || !member) {
      throw new Error("Error encountered");
    }
    if (book.copies <= 0) {
      throw new Error("Error encountered");
    }

    book.copies -= 1;
    this.emit("bookIssued", { title, memberId });
  }

  // Get all available books
  getAvailableBooks() {
    return Array.from(this.books.values()).filter((book) => book.copies > 0);
  }
}

module.exports = { LibrarySystem };