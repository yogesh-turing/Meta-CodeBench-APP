class LibraryInventory {
  constructor() {
    this.inventory = {};
  }

  addBook({ title, copies, section }) {
    if (!section || typeof section !== "string" || section.trim() === "") {
      throw "Invalid section identifier";
    }
    if (!title || typeof title !== "string" || title.trim() === "") {
      throw "Invalid book title";
    }
    if (!Number.isInteger(copies) || copies <= 0) {
      throw "Invalid copy count";
    }

    title = title.toLowerCase();
    section = section.toLowerCase();

    if (!this.inventory[section]) {
      this.inventory[section] = {};
    }

    if (this.inventory[section][title]) {
      this.inventory[section][title].copies += copies;
    } else {
      this.inventory[section][title] = { title, copies };
    }
  }

  totalCopies(title) {
    if (!title || typeof title !== "string" || title.trim() === "") {
      throw "Invalid book title";
    }

    title = title.toLowerCase();
    let total = 0;

    for (let section in this.inventory) {
      if (this.inventory[section][title]) {
        total += this.inventory[section][title].copies;
      }
    }

    return total > 0 ? total : "Book not available";
  }

  borrowBook({ title, copies, section }) {
    if (!title || typeof title !== "string" || title.trim() === "") {
      throw "Invalid book title";
    }
    if (!Number.isInteger(copies) || copies <= 0) {
      throw "Invalid copy count";
    }
    if (!section || typeof section !== "string" || section.trim() === "") {
      throw "Invalid section identifier";
    }

    title = title.toLowerCase();
    section = section.toLowerCase();

    if (!this.inventory[section] || !this.inventory[section][title]) {
      throw "Book not available in this section";
    }

    if (this.inventory[section][title].copies < copies) {
      throw "Not enough copies available";
    }

    this.inventory[section][title].copies -= copies;
  }

  sectionInventory(section) {
    if (!section || typeof section !== "string" || section.trim() === "") {
      throw "Invalid section identifier";
    }

    section = section.toLowerCase();

    if (!this.inventory[section]) {
      return "Section not found";
    }

    return Object.values(this.inventory[section]);
  }
}

module.exports = { LibraryInventory };