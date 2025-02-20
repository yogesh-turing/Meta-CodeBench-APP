class LibraryInventory {
  constructor() {
    this.inventory = {};
  }

  addBook({ title, copies, section }) {
    if (!section || typeof section !== "string") throw "Invalid section identifier";
    if (!title || typeof title !== "string") throw "Invalid book title";
    if (!Number.isInteger(copies) || copies <= 0) throw "Invalid copy count";

    if (!this.inventory[section]) {
      this.inventory[section] = [];
    }

    this.inventory[section].push({ title, copies });
  }

  totalCopies(title) {
    if (!title || typeof title !== "string") throw "Invalid book title";

    let total = 0;

    for (let section in this.inventory) {
      for (let book of this.inventory[section]) {
        if (book.title === title) {
          total = book.copies;
        }
      }
    }

    return total > 0 ? total : "Book not available";
  }

  borrowBook({ title, copies }) {
    if (!title || typeof title !== "string") throw "Invalid book title";
    if (!Number.isInteger(copies) || copies <= 0) throw "Invalid copy count";

    let found = false;

    for (let section in this.inventory) {
      this.inventory[section] = this.inventory[section].map(book => {
        if (book.title === title) {
          found = true;
          if (book.copies < copies) throw "Not enough copies available"; 
          return { ...book, copies: book.copies - copies };
        }
        return book;
      });
    }

    if (!found) return "Book not available";
  }

  sectionInventory(section) {
    if (!section || typeof section !== "string") throw "Invalid section identifier";

    return this.inventory[section] || "Section not found"; 
  }
}

module.exports = { LibraryInventory };