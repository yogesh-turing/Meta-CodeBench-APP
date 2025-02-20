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
    if (section !== undefined && (!section?.trim() || typeof section !== "string")) {
      throw "Invalid section identifier";
    }
  }

  addBook({ title, copies, section }) {
    this.validateInput(title, copies, section);
    title = title.trim().toLowerCase();
    section = section.trim();

    if (!this.inventory[section]) {
      this.inventory[section] = new Map();
    }

    const existingCopies = this.inventory[section].get(title);
    if (existingCopies) {
      this.inventory[section].set(title, existingCopies + copies);
    } else {
      this.inventory[section].set(title, copies);
    }
  }

  totalCopies(title) {
    this.validateInput(title, 1);
    title = title.trim().toLowerCase();

    let total = 0;
    for (const section of Object.values(this.inventory)) {
      const copies = section.get(title) || 0;
      total += copies;
    }

    return total > 0 ? total : "Book not available";
  }

  borrowBook({ title, copies, section }) {
    this.validateInput(title, copies, section);
    title = title.trim().toLowerCase();
    section = section.trim();

    if (!this.inventory[section]) {
      throw "Section not found";
    }

    const sectionBooks = this.inventory[section];
    const availableCopies = sectionBooks.get(title);

    if (!availableCopies) {
      throw "Book not available in this section";
    }

    if (availableCopies < copies) {
      throw "Not enough copies available";
    }

    const remainingCopies = availableCopies - copies;
    if (remainingCopies === 0) {
      sectionBooks.delete(title);
      if (sectionBooks.size === 0) {
        delete this.inventory[section];
      }
    } else {
      sectionBooks.set(title, remainingCopies);
    }

    return {
      title,
      borrowedCopies: copies,
      remainingCopies
    };
  }

  sectionInventory(section) {
    this.validateInput(section, 1, section);
    section = section.trim();

    if (!this.inventory[section]) {
      return "Section not found";
    }

    const books = [];
    for (const [title, copies] of this.inventory[section]) {
      books.push({ title, copies });
    }

    return books;
  }
}

module.exports = { LibraryInventory };