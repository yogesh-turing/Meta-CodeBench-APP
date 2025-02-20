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
      const book = this.inventory[section].find(book => book.title.toLowerCase() === title.toLowerCase());
      if (book) {
        total += book.copies;
      }
    }

    return total > 0 ? total : "Book not available";
  }

  borrowBook({ title, copies, section }) {
    if (!title || typeof title !== "string" || title.trim() === "") throw "Invalid book title";
    if (!Number.isInteger(copies) || copies <= 0) throw "Invalid copy count";
    if (!section || typeof section !== "string" || section.trim() === "") throw "Invalid section identifier";

    const book = this.inventory[section].find(book => book.title.toLowerCase() === title.toLowerCase());
    if (!book) throw "Book not available in this section";

    if (book.copies < copies) throw "Not enough copies available";
    book.copies -= copies;
  }

  sectionInventory(section) {
    if (!section || typeof section !== "string" || section.trim() === "") throw "Invalid section identifier";

    return this.inventory[section] || "Section not found";
  }
}

module.exports = { LibraryInventory };