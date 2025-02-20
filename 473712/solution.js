/**
 * A class to manage a library inventory system.
 * Allows adding books, borrowing books, getting total copies, and checking section inventory.
 */
class LibraryInventory {
  /**
   * Creates an instance of LibraryInventory.
   * Initializes an empty inventory (sections).
   */
  constructor() {
    this.sections = {}; // Holds sections and the books in each section
  }

  /**
   * Validates the input for adding books or borrowing books.
   * Ensures the title is a non-empty string, copies are a positive number, and section is a non-empty string.
   * 
   * @param {string} title - The title of the book.
   * @param {number} copies - The number of copies of the book.
   * @param {string} section - The section where the book is stored.
   * @throws {Error} Throws an error if the title, copies, or section are invalid.
   */
  validateInput(title, copies, section) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('Invalid book title');
    }
    if (typeof copies !== 'number' || copies <= 0 || isNaN(copies)) {
      throw new Error('Invalid copy count');
    }
    if (typeof section !== 'string' || section.trim() === '') {
      throw new Error('Invalid section identifier');
    }
  }

  /**
   * Adds a book to the inventory or updates the number of copies if the book already exists.
   * 
   * @param {Object} bookDetails - The details of the book being added.
   * @param {string} bookDetails.title - The title of the book.
   * @param {number} bookDetails.copies - The number of copies of the book.
   * @param {string} bookDetails.section - The section where the book should be placed.
   */
  addBook({ title, copies, section }) {
    this.validateInput(title, copies, section);

    // If section doesn't exist, create it
    if (!this.sections[section]) {
      this.sections[section] = [];
    }

    // Check if the book already exists in the section (case-insensitive)
    let book = this.sections[section].find(b => b.title.toLowerCase() === title.toLowerCase());

    if (book) {
      // If book exists, increase the copies
      book.copies += copies;
    } else {
      // Otherwise, add the new book to the section
      this.sections[section].push({ title, copies });
    }
  }

  /**
   * Retrieves the total number of copies of a book across all sections.
   * The search is case-insensitive.
   * 
   * @param {string} title - The title of the book.
   * @returns {number|string} Returns the total copies of the book or 'Book not available' if no copies are found.
   */
  totalCopies(title) {
    let total = 0;
    const lowerCaseTitle = title.toLowerCase();

    // Iterate through each section and check for the book
    for (const section in this.sections) {
      const book = this.sections[section].find(b => b.title.toLowerCase() === lowerCaseTitle);
      if (book) {
        total += book.copies;
      }
    }

    if (total === 0) {
      return 'Book not available';
    }

    return total;
  }

  /**
   * Borrows a specific number of copies of a book, reducing the available copies.
   * Throws an error if there are not enough copies available or if the book does not exist.
   * 
   * @param {Object} borrowDetails - The details of the book to borrow.
   * @param {string} borrowDetails.title - The title of the book to borrow.
   * @param {number} borrowDetails.copies - The number of copies to borrow.
   * @throws {Error} Throws an error if there are not enough copies or if the book does not exist.
   */
  borrowBook({ title, copies }) {
    if (typeof copies !== 'number' || copies <= 0 || isNaN(copies)) {
      throw new Error('Invalid copy count');
    }

    let found = false;

    // Iterate through sections to find the book
    for (const section in this.sections) {
      const book = this.sections[section].find(b => b.title.toLowerCase() === title.toLowerCase());

      if (book) {
        found = true;
        if (book.copies < copies) {
          throw new Error('Not enough copies available');
        } else {
          // Reduce the available copies
          book.copies -= copies;
          return;
        }
      }
    }

    if (!found) {
      throw new Error('Book not available');
    }
  }

  /**
   * Retrieves all books in a given section.
   * Returns 'Section not found' if the section doesn't exist.
   * 
   * @param {string} section - The section to get the inventory for.
   * @returns {Array|string} Returns an array of books in the section or a message if the section is not found.
   */
  sectionInventory(section) {
    if (!this.sections[section]) {
      return 'Section not found';
    }
    return this.sections[section];
  }
}

module.exports = { LibraryInventory };