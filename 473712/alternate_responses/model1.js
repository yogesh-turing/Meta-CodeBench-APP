class LibraryInventory {
  constructor() {
    this.inventory = {};
  }

  validateInput(title, copies, section) {
    if (!title?.trim() || typeof title !== "string") {
      throw new Error("Invalid book title");
    }
    if (!Number.isInteger(copies) || copies <= 0) {
      throw new Error("Invalid copy count");
    }
    if (section !== undefined && (!section?.trim() || typeof section !== "string")) {
      throw new Error("Invalid section identifier");
    }
  }

  normalizeTitle(title) {
    return title.trim().toLowerCase();
  }

  addBook({ title, copies, section }) {
    this.validateInput(title, copies, section);
    const normalizedTitle = this.normalizeTitle(title);
    
    if (!this.inventory[section]) {
      this.inventory[section] = [];
    }

    const existingBookIndex = this.inventory[section].findIndex(
      book => this.normalizeTitle(book.title) === normalizedTitle
    );

    if (existingBookIndex !== -1) {
      this.inventory[section][existingBookIndex].copies += copies;
    } else {
      this.inventory[section].push({ title: title.trim(), copies });
    }
  }

  totalCopies(title) {
    this.validateInput(title, 1); // Using 1 as dummy copies value for validation
    const normalizedTitle = this.normalizeTitle(title);
    
    let total = 0;
    for (const section in this.inventory) {
      const sectionBooks = this.inventory[section];
      for (const book of sectionBooks) {
        if (this.normalizeTitle(book.title) === normalizedTitle) {
          total += book.copies;
        }
      }
    }

    return total > 0 ? total : "Book not available";
  }

  borrowBook({ title, copies, section }) {
    this.validateInput(title, copies, section);
    const normalizedTitle = this.normalizeTitle(title);

    if (!this.inventory[section]) {
      throw new Error("Section not found");
    }

    const bookIndex = this.inventory[section].findIndex(
      book => this.normalizeTitle(book.title) === normalizedTitle
    );

    if (bookIndex === -1) {
      throw new Error("Book not available in this section");
    }

    const book = this.inventory[section][bookIndex];
    if (book.copies < copies) {
      throw new Error("Not enough copies available");
    }

    book.copies -= copies;
    
    // Remove book from inventory if no copies left
    if (book.copies === 0) {
      this.inventory[section].splice(bookIndex, 1);
    }

    return true;
  }

  sectionInventory(section) {
    this.validateInput("dummy", 1, section); // Using dummy values for title and copies validation
    
    if (!this.inventory[section]) {
      return "Section not found";
    }

    return [...this.inventory[section]].map(book => ({
      title: book.title,
      copies: book.copies
    }));
  }
}

module.exports = { LibraryInventory };