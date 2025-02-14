const { LibrarySystem } = require('./alternate_responses/model10');

describe("LibrarySystem", () => {
  let library;

  beforeEach(() => {
    library = new LibrarySystem();
  });

  test("should add a new book", () => {
    library.addBook("1984", "George Orwell", 3);
    expect(Array.from(library.books.values())).toEqual([
      { title: "1984", author: "George Orwell", copies: 3 },
    ]);
  });

  test("should register a new member", () => {
    library.registerMember("Alice", 101);
    expect(Array.from(library.members.values())).toEqual([
      { name: "Alice", id: 101 },
    ]);
  });

  test("should throw an error when registering a member with the same ID", () => {
    library.registerMember("Alice", 101);
    expect(() => library.registerMember("Bob", 101)).toThrow("Error encountered");
  });

  test("should issue a book to a member", () => {
    library.addBook("1984", "George Orwell", 3);
    library.registerMember("Alice", 101);
    library.issueBook("1984", 101);
    expect(library.books.get("1984").copies).toBe(2);
  });

  test("should throw an error when issuing a book that doesn't exist", () => {
    library.registerMember("Alice", 101);
    expect(() => library.issueBook("Unknown Book", 101)).toThrow("Error encountered");
  });

  test("should throw an error when issuing a book to a non-existent member", () => {
    library.addBook("1984", "George Orwell", 3);
    expect(() => library.issueBook("1984", 999)).toThrow("Error encountered");
  });

  test("should throw an error when issuing more books than available", () => {
    library.addBook("1984", "George Orwell", 1);
    library.registerMember("Alice", 101);
    expect(() => library.issueBook("1984", 101)).not.toThrow();
    expect(() => library.issueBook("1984", 101)).toThrow("Error encountered");
  });

  test("should return all books with copies available", () => {
    library.addBook("1984", "George Orwell", 3);
    library.addBook("To Kill a Mockingbird", "Harper Lee", 2);
    expect(library.getAvailableBooks()).toEqual([
      { title: "1984", author: "George Orwell", copies: 3 },
      { title: "To Kill a Mockingbird", author: "Harper Lee", copies: 2 }
    ]);
  });

  test("should emit 'bookAdded' event when adding a book", (done) => {
    library.on("bookAdded", (book) => {
      expect(book).toEqual({ title: "1984", author: "George Orwell", copies: 3 });
      done();
    });
    library.addBook("1984", "George Orwell", 3);
  });

  test("should emit 'memberRegistered' event when registering a member", (done) => {
    library.on("memberRegistered", (member) => {
      expect(member).toEqual({ name: "Alice", id: 101 });
      done();
    });
    library.registerMember("Alice", 101);
  });

  test("should emit 'bookIssued' event when issuing a book", (done) => {
    library.addBook("1984", "George Orwell", 3);
    library.registerMember("Alice", 101);
    library.on("bookIssued", (data) => {
      expect(data).toEqual({ title: "1984", memberId: 101 });
      done();
    });
    library.issueBook("1984", 101);
  });

  test("should throw an error when adding a book with invalid input", () => {
    expect(() => library.addBook(null, "Author", 3)).toThrow("Error encountered");
    expect(() => library.addBook("Title", null, 3)).toThrow("Error encountered");
    expect(() => library.addBook("Title", "Author", -3)).toThrow("Error encountered");
  });

  test("should throw an error when registering a member with invalid input", () => {
    expect(() => library.registerMember(null, 101)).toThrow("Error encountered");
    expect(() => library.registerMember("Alice", null)).toThrow("Error encountered");
    expect(() => library.registerMember("Alice", "invalidId")).toThrow(
      "Error encountered"
    );
  });

  test("should throw an error when issuing a book with invalid input", () => {
    expect(() => library.issueBook(null, 101)).toThrow("Error encountered");
    expect(() => library.issueBook("1984", null)).toThrow("Error encountered");
    expect(() => library.issueBook("1984", "invalidId")).toThrow("Error encountered");
  });
});