const { BookRecommendationSystem } = require(process.env.TARGET_FILE);

describe("BookRecommendationSystem", () => {
  let system;

  beforeEach(() => {
    system = new BookRecommendationSystem();
  });

  // Test: Add Book
  test("should add a new book to the catalog", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    expect(system.books.length).toBe(1);
    expect(system.books[0].title).toBe("Harry Potter");
  });

  test("should throw an error when adding a book with invalid details", () => {
    expect(() => system.addBook("", "", "", 1, "", 6)).toThrow(
      "Book Detail Invalid"
    );
  });

  test("should throw an error when adding a book with invalid rating", () => {
    expect(() =>
      system.addBook(
        "1",
        "Harry Potter",
        "J.K. Rowling",
        "Fantasy",
        500,
        "A young wizard story.",
        -1
      )
    ).toThrow("Invalid rating");
  });

  test("should throw an error when adding a book with invalid rating", () => {
    expect(() =>
      system.addBook(
        "1",
        "Harry Potter",
        "J.K. Rowling",
        "Fantasy",
        -1,
        "A young wizard story.",
        1
      )
    ).toThrow("Invalid length");
  });

  // Test: Add User
  test("should add a new user to the system", () => {
    system.addUser("user1", "Alice", {
      genre: "Fantasy",
      length: { min: 100, max: 500 },
    });
    expect(system.users.length).toBe(1);
    expect(system.users[0].name).toBe("Alice");
  });

  test("should throw an error when adding a user with invalid details", () => {
    expect(() => system.addUser("", {})).toThrow("Book Detail Invalid");
    expect(() =>
      system.addUser("user2", "Bob", {
        genre: "Fantasy",
        length: { min: "a", max: 500 },
      })
    ).toThrow("Book Detail Invalid");
  });

  test("should throw an error when adding a user with invalid details ie prefernce having invalid genera", () => {
    expect(() => system.addUser({})).toThrow("Book Detail Invalid");
    expect(() =>
      system.addUser("user2", "Bob", {
        genre: 123,
        length: { min: 1, max: 500 },
      })
    ).toThrow("Book Detail Invalid");
  });

  // Test: Mark Book as Read
  test("should mark a book as read for a user", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    system.addUser("user1", "Alice");
    system.markBookAsRead("user1", "1");
    expect(system.users[0].readingHistory).toContain("1");
  });

  test("should throw an error if the user or book does not exist", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    system.addUser("user1", "Alice");
    expect(() => system.markBookAsRead("user1", "2")).toThrow(
      "Book Detail Invalid"
    );
    expect(() => system.markBookAsRead("nonExistentUser", "1")).toThrow(
      "Book Detail Invalid"
    );
  });

  // Test: Get Reading History
  test("should get reading history for a user", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    system.addUser("user1", "Alice");
    system.markBookAsRead("user1", "1");
    const history = system.getReadingHistory("user1");
    expect(history).toEqual(["Harry Potter"]);
  });

  test('should return "No books read yet" if the user has no books in history', () => {
    system.addUser("user1", "Alice");
    const history = system.getReadingHistory("user1");
    expect(history).toBe("No books read yet");
  });

  test("should throw error if the user provided is invalid type", () => {
    system.addUser("user1", "Alice");
    expect(() => system.getReadingHistory(123)).toThrow("Book Detail Invalid");
  });
  // Test: Get Books by Genre
  test("should get books by genre", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    system.addBook(
      "2",
      "The Hobbit",
      "J.R.R. Tolkien",
      "Fantasy",
      300,
      "A hobbit adventure.",
      4.8
    );
    const books = system.getBooksByGenre("Fantasy");
    expect(books.length).toBe(2);
    expect(books[0].bookId).toBe("1");
    expect(books[1].bookId).toBe("2");
  });

  test('should return "No books found in this genre" when no books match the genre', () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    const books = system.getBooksByGenre("Mystery");
    expect(books).toBe("No books found in this genre");
  });

  test("should throw error if genre is of invalid type in getBookByGenre", () => {
    expect(() => system.getBooksByGenre(123)).toThrow("Book Detail Invalid");
  });

  // Test: Get Books by Length
  test("should get books within a specific length range", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    system.addBook(
      "2",
      "The Hobbit",
      "J.R.R. Tolkien",
      "Fantasy",
      300,
      "A hobbit adventure.",
      4.8
    );
    const books = system.getBooksByLength(100, 400);
    expect(books.length).toBe(1);
    expect(books[0].bookId).toBe("2");
  });

  test('should return "No books found in the specified length range" when no books match the length range', () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    const books = system.getBooksByLength(600, 800);
    expect(books).toBe("No books found in the specified length range");
  });

  // Test: Rate Book
  test("should rate a book", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story."
    );
    system.rateBook("1", 5);
    expect(system.books[0].rating).toBe(5);
  });

  test("should throw an error when rating a book with invalid rating", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    expect(() => system.rateBook("1", 6)).toThrow("Book Detail Invalid");
    expect(() => system.rateBook("1", -1)).toThrow("Book Detail Invalid");
  });

  // Test: Get Books by Author
  test("should get books by author", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    system.addBook(
      "2",
      "Fantastic Beasts",
      "J.K. Rowling",
      "Fantasy",
      300,
      "A wizard story.",
      4.7
    );
    const books = system.getBooksByAuthor("J.K. Rowling");
    expect(books.length).toBe(2);
    expect(books[0].bookId).toBe("1");
    expect(books[1].bookId).toBe("2");
  });

  test('should return "No books found by this author" when no books match the author', () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    const books = system.getBooksByAuthor("George R. R. Martin");
    expect(books).toBe("No books found by this author");
  });

  // Test: Get Top Rated Books
  test("should get top-rated books", () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      4.5
    );
    system.addBook(
      "2",
      "The Hobbit",
      "J.R.R. Tolkien",
      "Fantasy",
      300,
      "A hobbit adventure.",
      4.8
    );
    const topBooks = system.getTopRatedBooks();
    console.log(topBooks, "top");
    expect(topBooks.length).toBe(2);
    expect(topBooks[0].rating).toBe(4.8);
  });

  test('should return "No rated books available" when no books have a rating', () => {
    system.addBook(
      "1",
      "Harry Potter",
      "J.K. Rowling",
      "Fantasy",
      500,
      "A young wizard story.",
      undefined
    );
    const topBooks = system.getTopRatedBooks();
    expect(topBooks).toBe("No rated books available");
  });
});
