const EventEmitter = require('events');

class LibrarySystem extends EventEmitter {
  constructor() {
    super();
    this.books = new Map();
    this.members = new Map();
  }

  addBook(title, author, copies) {
    if (!title || !author || !copies || typeof copies !== "number" || copies <= 0) {
      throw new Error("Error encountered");
    }
    this.books.set(title, { title, author, copies });
    this.emit("bookAdded", this.books.get(title));
  }

  registerMember(name, id) {
    if (!name || !id || typeof id !== "number") {
      throw new Error("Error encountered");
    }
    this.members.set(id, { name, id });
    this.emit("memberRegistered", this.members.get(id));
  }

  issueBook(title, memberId) {
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
}

module.exports = { LibrarySystem };