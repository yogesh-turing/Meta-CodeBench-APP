class Library {
    constructor() {
      this.books = [];
      this.members = [];
    }
  
    addBook(title, author, copies) {
      if (!title || !author || !copies || typeof copies !== "number" || copies <= 0) {
        throw new Error("Error encountered");
      }
      this.books.push({ title, author, copies });
    }
  
    addMember(name, id) {
      if (!name || !id || typeof id !== "number") {
        throw new Error("Error encountered");
      }
      this.members.push({ name, id });
    }
  
    issueBook(title, memberId) {
      const book = this.books.find((b) => b.title === title);
      const member = this.members.find((m) => m.id === memberId);
  
      if (!book || !member) {
        throw new Error("Error encountered");
      }
      if (book.copies <= 0) {
        throw new Error("Error encountered");
      }
      book.copies -= 1;
    }
  }
  
  module.exports = { Library };