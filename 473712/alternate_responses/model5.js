class LibraryInventory {
  constructor() {
    this.inventory = {};
  }

  validateInput(title, copies, section) {
    if (!title || typeof title !== "string" || title.trim() === "") {
      throw "Invalid book title";
    }
    if (!Number.isInteger(copies) || copies <= 0) {
      throw "Invalid copy count";
    }
    if (section && (typeof section !== "string" || section.trim() === "")) {
      throw "Invalid section identifier";
    }
  }

  addBook({ title, copies, section }) {
    this.validateInput(title, copies, section);
    
    const normalizedTitle = title.trim().toLowerCase();
    const normalizedSection = section.trim();

    if (!this.inventory[normalizedSection]) {
      this.inventory[normalizedSection] = [];
    }

    const existingBookIndex = this.inventory[normalizedSection].findIndex(
      book => book.title.toLowerCase() === normalizedTitle
    );

    if (existingBookIndex >= 0) {
      this.inventory[normalizedSection][existingBookIndex].copies += copies;
    } else {
      this.inventory[normalizedSection].push({ 
        title: title.trim(), 
        copies 
      });
    }
  }

  totalCopies(title) {
    if (!title || typeof title !== "string" || title.trim() === "") {
      throw "Invalid book title";
    }

    const normalizedTitle = title.trim().toLowerCase();
    let total = 0;

    for (const section in this.inventory) {
      const bookInSection = this.inventory[section].find(
        book => book.title.toLowerCase() === normalizedTitle
      );
      if (bookInSection) {
        total += bookInSection.copies;
      }
    }

    return total > 0 ? total : "Book not available";
  }

  borrowBook({ title, copies, section }) {
    this.validateInput(title, copies, section);
    
    const normalizedTitle = title.trim().toLowerCase();
    const normalizedSection = section.trim();

    if (!this.inventory[normalizedSection]) {
      throw "Section not found";
    }

    const bookIndex = this.inventory[normalizedSection].findIndex(
      book => book.title.toLowerCase() === normalizedTitle
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
      this.inventory[normalizedSection] = this.inventory[normalizedSection].filter(
        (_, index) => index !== bookIndex
      );
    }

    return {
      title: book.title,
      borrowedCopies: copies,
      remainingCopies: book.copies
    };
  }

  sectionInventory(section) {
    if (!section || typeof section !== "string" || section.trim() === "") {
      throw "Invalid section identifier";
    }

    const normalizedSection = section.trim();
    const sectionBooks = this.inventory[normalizedSection];

    if (!sectionBooks || sectionBooks.length === 0) {
      return "Section not found";
    }

    return sectionBooks.map(book => ({
      title: book.title,
      copies: book.copies
    }));
  }
}

module.exports = { LibraryInventory };