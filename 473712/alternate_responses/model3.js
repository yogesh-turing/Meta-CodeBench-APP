class LibraryInventory {
  constructor() {
    this.inventory = {};
  }

  validateInput(title, copies, section) {
    if (!title?.trim() || typeof title !== "string") {
      throw "Invalid book title";
    }
    if (!Number.isInteger(copies) || copies <= 0) {
      throw "Invalid copy count";
    }
    if (section && (!section?.trim() || typeof section !== "string")) {
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

    const existingBookIndex = this.inventory[normalizedSection]
      .findIndex(book => this.normalizeString(book.title) === normalizedTitle);

    if (existingBookIndex >= 0) {
      this.inventory[normalizedSection][existingBookIndex].copies += copies;
    } else {
      this.inventory[normalizedSection].push({ title: title.trim(), copies });
    }
  }

  totalCopies(title) {
    if (!title?.trim() || typeof title !== "string") {
      throw "Invalid book title";
    }

    const normalizedTitle = this.normalizeString(title);
    let total = 0;

    for (const section in this.inventory) {
      const bookCopies = this.inventory[section]
        .reduce((sum, book) => 
          this.normalizeString(book.title) === normalizedTitle ? 
            sum + book.copies : sum, 0);
      total += bookCopies;
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

    const bookIndex = this.inventory[normalizedSection]
      .findIndex(book => this.normalizeString(book.title) === normalizedTitle);

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

    return book.copies;
  }

  sectionInventory(section) {
    if (!section?.trim() || typeof section !== "string") {
      throw "Invalid section identifier";
    }

    const normalizedSection = this.normalizeString(section);
    
    if (!this.inventory[normalizedSection] || 
        this.inventory[normalizedSection].length === 0) {
      return "Section not found";
    }

    return [...this.inventory[normalizedSection]]
      .map(book => ({ ...book }));
  }
}

module.exports = { LibraryInventory };