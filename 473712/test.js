//LibraryInventory.test.js
const { LibraryInventory } = require("./solution"); // Adjust the path as needed

describe("LibraryInventory", () => {
  let library;

  beforeEach(() => {
    library = new LibraryInventory();
  });

  describe("addBook", () => {
    test("should add a new book to the inventory", () => {
      library.addBook({ title: "Moby Dick", copies: 5, section: "Fiction" });
      expect(library.sectionInventory("Fiction")).toEqual([
        { title: "Moby Dick", copies: 5 },
      ]);
    });

    test("should update copies if the same book is added to the same section", () => {
      library.addBook({ title: "Moby Dick", copies: 5, section: "Fiction" });
      library.addBook({ title: "Moby Dick", copies: 3, section: "Fiction" });
      expect(library.sectionInventory("Fiction")).toEqual([
        { title: "Moby Dick", copies: 8 },
      ]);
    });

    test("should add the same book to a different section", () => {
      library.addBook({ title: "Moby Dick", copies: 5, section: "Fiction" });
      library.addBook({ title: "Moby Dick", copies: 3, section: "Classics" });
      expect(library.sectionInventory("Fiction")).toEqual([
        { title: "Moby Dick", copies: 5 },
      ]);
      expect(library.sectionInventory("Classics")).toEqual([
        { title: "Moby Dick", copies: 3 },
      ]);
    });

    test("should throw an error for invalid section", () => {
      expect(() =>
        library.addBook({ title: "Moby Dick", copies: 5, section: "" })
      ).toThrow("Invalid section identifier");
      expect(() =>
        library.addBook({ title: "Moby Dick", copies: 5, section: 123 })
      ).toThrow("Invalid section identifier");
    });

    test("should throw an error for invalid title", () => {
      expect(() =>
        library.addBook({ title: "", copies: 5, section: "Fiction" })
      ).toThrow("Invalid book title");
      expect(() =>
        library.addBook({ title: 123, copies: 5, section: "Fiction" })
      ).toThrow("Invalid book title");
    });

    test("should throw an error for invalid copies", () => {
      expect(() =>
        library.addBook({ title: "Moby Dick", copies: 0, section: "Fiction" })
      ).toThrow("Invalid copy count");
      expect(() =>
        library.addBook({ title: "Moby Dick", copies: -1, section: "Fiction" })
      ).toThrow("Invalid copy count");
      expect(() =>
        library.addBook({
          title: "Moby Dick",
          copies: "five",
          section: "Fiction",
        })
      ).toThrow("Invalid copy count");
    });
  });

  describe("totalCopies", () => {
    test("should return the correct total copies across all sections", () => {
      library.addBook({ title: "Moby Dick", copies: 3, section: "Fiction" });
      library.addBook({ title: "Moby Dick", copies: 2, section: "Classics" });
      expect(library.totalCopies("Moby Dick")).toBe(5);
    });

    test('should return "Book not available" if the book does not exist', () => {
      expect(library.totalCopies("NonExistentBook")).toBe("Book not available");
    });
  });

  describe("borrowBook", () => {
    test("should correctly reduce available copies", () => {
      library.addBook({ title: "Moby Dick", copies: 5, section: "Fiction" });
      library.borrowBook({ title: "Moby Dick", copies: 2 });
      expect(library.sectionInventory("Fiction")).toEqual([
        { title: "Moby Dick", copies: 3 },
      ]);
    });

    test("should throw an error if not enough copies are available", () => {
      library.addBook({ title: "Moby Dick", copies: 5, section: "Fiction" });
      expect(() =>
        library.borrowBook({ title: "Moby Dick", copies: 6 })
      ).toThrow("Not enough copies available");
    });

    test("should throw an error if the book does not exist", () => {
      expect(() =>
        library.borrowBook({ title: "NonExistentBook", copies: 1 })
      ).toThrow("Book not available");
    });

    test("should throw an error for invalid copies", () => {
      expect(() =>
        library.borrowBook({ title: "Moby Dick", copies: "two" })
      ).toThrow("Invalid copy count");
    });
  });

  describe("sectionInventory", () => {
    test("should return all books in a section", () => {
      library.addBook({ title: "Moby Dick", copies: 3, section: "Fiction" });
      library.addBook({ title: "1984", copies: 2, section: "Fiction" });
      expect(library.sectionInventory("Fiction")).toEqual([
        { title: "Moby Dick", copies: 3 },
        { title: "1984", copies: 2 },
      ]);
    });

    test('should return "Section not found" if the section does not exist', () => {
      expect(library.sectionInventory("Sci-Fi")).toBe("Section not found");
    });
  });

  describe("edge cases", () => {
    test("should handle large inventory efficiently", () => {
      for (let i = 0; i < 10000; i++) {
        library.addBook({
          title: `Book${i}`,
          copies: 1,
          section: `Section${i}`,
        });
      }
      expect(library.sectionInventory("Section9999")).toEqual([
        { title: "Book9999", copies: 1 },
      ]);
    });

    test("should handle concurrent transactions correctly", () => {
      library.addBook({ title: "Moby Dick", copies: 10, section: "Fiction" });
      library.borrowBook({ title: "Moby Dick", copies: 3 });
      library.addBook({ title: "Moby Dick", copies: 2, section: "Fiction" });
      expect(library.sectionInventory("Fiction")).toEqual([
        { title: "Moby Dick", copies: 9 },
      ]);
    });

    test("should handle case sensitivity for book titles", () => {
      library.addBook({ title: "Moby Dick", copies: 3, section: "Fiction" });
      library.addBook({ title: "moby dick", copies: 2, section: "Fiction" });
      expect(library.totalCopies("Moby Dick")).toBe(5);
    });

    test("should reject whitespace-only titles or sections", () => {
      expect(() =>
        library.addBook({ title: "   ", copies: 5, section: "Fiction" })
      ).toThrow("Invalid book title");
      expect(() =>
        library.addBook({ title: "Moby Dick", copies: 5, section: "   " })
      ).toThrow("Invalid section identifier");
    });
  });
});
