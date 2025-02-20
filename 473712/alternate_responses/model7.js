class LibraryInventory {
  constructor() {
    this.inventory = {};
  }

  addBook({ title, copies, section }) {
    if (!section || typeof section !== "string" || section.trim() === "") throw "Invalid section identifier";
    if (!title || typeof title !== "string" || title.trim() === "") throw "Invalid book title";
    if (!Number.isInteger(copies) || copies <= 0) throw "Invalid copy count";

    title = title.toLowerCase();
    section = section.toLowerCase();

    if (!this.inventory[section]) {
      this.inventory[section] = {};
    }

    if (this.inventory[section][title]) {
      this.inventory[section][title] += copies;
    } else {
      this.inventory[section][title] = copies;
    }
  }

  totalCopies(title) {
    if (!title || typeof title !== "string" || title.trim() === "") throw "Invalid book title";

    title = title.toLowerCase();
    let total = 0;

    for (let section in this.inventory) {
      if (this.inventory[section][title]) {
        total += this.inventory[section][title];
      }
    }

    return total > 0 ? total : "Book not available";
  }

  borrowBook({ title, copies }) {
    if (!title || typeof title !== "string" || title.trim() === "") throw "Invalid book title";
    if (!Number.isInteger(copies) || copies <= 0) throw "Invalid copy count";

    title = title.toLowerCase();
    let found = false;

    for (let section in this.inventory) {
      if (this.inventory[section][title]) {
        found = true;
        if (this.inventory[section][title] < copies) throw "Not enough copies available"; 
        this.inventory[section][title] -= copies;
        break;
      }
    }

    if (!found) throw "Book not available";
  }

  sectionInventory(section) {
    if (!section || typeof section !== "string" || section.trim() === "") throw "Invalid section identifier";

    section = section.toLowerCase();
    let books = [];

    if (this.inventory[section]) {
      for (let title in this.inventory[section]) {
        books.push({ title, copies: this.inventory[section][title] });
      }
    }

    return books.length > 0 ? books : "Section not found"; 
  }
}

module.exports = { LibraryInventory };