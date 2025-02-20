class LibraryInventory {
  constructor() {
    this.inventory = {};
  }

  validateInput(title, copies, section) {
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      throw "Invalid book title";
    }
    if (!Number.isInteger(copies) || copies <= 0) {
      throw "Invalid copy count";
    }
    if (section && (typeof section !== "string" || section.trim().length === 0)) {
      throw "Invalid section identifier";
    }
  }

  normalizeString(str) {
    return str.trim().toLowerCase();
  }

  addBook({ title, copies, section }) {
    this.validateInput(title, copies, section);
    
    const normalizedTitle = this.normalizeString(title);
    const normalizedSection = this.normalizeString(section);

    if (!this.inventory[normalizedSection]) {
      this.inventory[normalizedSection] = [];
    }

    const existingBook = this.inventory[normalizedSection].find(
      book => this.normalizeString(book.title) === normalizedTitle
    );

    if (existingBook) {
      existingBook.copies += copies;
    } else {
      this.inventory[normalizedSection].push({ title: normalizedTitle, copies });
    }
  }

  totalCopies(title) {
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      throw "Invalid book title";
    }

    const normalizedTitle = this.normalizeString(title);
    let total = 0;

    for (const section in this.inventory) {
      const books = this.inventory[section];
      for (const book of books) {
        if (this.normalizeString(book.title) === normalizedTitle) {
          total += book.copies;
        }
      }
    }

    return total > 0 ? total : "Book not available";
  }

  borrowBook({ title, copies, section }) {
    this.validateInput(title, copies, section);
    
    const normalizedTitle = this.normalizeString(title);
    const normalizedSection = this.normalizeString(section);

    if (!this.inventory[normalizedSection]) {
      throw "Section not found";
    }

    const bookIndex = this.inventory[normalizedSection].findIndex(
      book => this.normalizeString(book.title) === normalizedTitle
    );

    if (bookIndex === -1) {
      throw "Book not available in this section";
    }

    const book = this.inventory[normalizedSection][bookIndex];
    if (book.copies < copies) {
      throw "Not enough copies available";
    }

    book.copies -= copies;

    // Remove book from inventory if no copies left
    if (book.copies === 0) {
      this.inventory[normalizedSection].splice(bookIndex, 1);
    }

    return {
      title: normalizedTitle,
      borrowedCopies: copies,
      remainingCopies: book.copies
    };
  }

  sectionInventory(section) {
    if (!section || typeof section !== "string" || section.trim().length === 0) {
      throw "Invalid section identifier";
    }

    const normalizedSection = this.normalizeString(section);
    
    if (!this.inventory[normalizedSection]) {
      return "Section not found";
    }

    return [...this.inventory[normalizedSection]].map(book => ({
      title: book.title,
      copies: book.copies
    }));
  }
}

module.exports = { LibraryInventory };