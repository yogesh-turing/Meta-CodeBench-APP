class LibraryInventory {
  constructor() {
    this.inventory = {};
  }

  addBook({ title, copies, section }) {
    if (!section || typeof section !== "string" || section.trim() === "") throw "Invalid section identifier";
    if (!title || typeof title !== "string" || title.trim() === "") throw "Invalid book title";
    if (!Number.isInteger(copies) || copies <= 0) throw "Invalid copy count";

    if (!this.inventory[section]) {
      this.inventory[section] = [];
    }

    const existingBook = this.inventory[section].find(book => book.title.toLowerCase() === title.toLowerCase());

    if (existingBook) {
      existingBook.copies += copies;
    } else {
      this.inventory[section].push({ title, copies });
    }
  }

  totalCopies(title) {
    if (!title || typeof title !== "string" || title.trim() === "") throw "Invalid book title";

    let total = 0;

    for (let section in this.inventory) {
      for (let book of this.inventory[section]) {
        if (book.title.toLowerCase() === title.toLowerCase()) {
          total += book.copies;
        }
      }
    }

    return total > 0 ? total : "Book not available";
  }

  borrowBook({ title, copies, section }) {
    if (!title || typeof title !== "string" || title.trim() === "") throw "Invalid book title";
    if (!Number.isInteger(copies) || copies <= 0) throw "Invalid copy count";
    if (!section || typeof section !== "string" || section.trim() === "") throw "Invalid section identifier";

    let found = false;

    for (let sec in this.inventory) {
      if (sec === section) {
        this.inventory[sec] = this.inventory[sec].map(book => {
          if (book.title.toLowerCase() === title.toLowerCase()) {
            found = true;
            if (book.copies < copies) throw "Not enough copies available"; 
            return { ...book, copies: book.copies - copies };
          }
          return book;
        });
      }
    }

    if (!found) return "Book not available";
  }

  sectionInventory(section) {
    if (!section || typeof section !== "string" || section.trim() === "") throw "Invalid section identifier";

    return this.inventory[section] || "Section not found"; 
  }
}

module.exports = { LibraryInventory };