const S = require("sanctuary");

class BookRecommendationSystem {
  constructor() {
    this.books = [];
    this.users = [];
  }

  addBook(bookId, title, author, genre, length, description, rating = 0) {
    if (
      typeof bookId !== "string" ||
      typeof title !== "string" ||
      typeof author !== "string" ||
      typeof genre !== "string" ||
      typeof description !== "string" ||
      typeof length !== "number" ||
      typeof rating !== "number" ||
      !bookId ||
      !title ||
      !author ||
      !genre ||
      !description
    ) {
      throw new Error("Book Detail Invalid");
    }

    if (rating < 0 || rating > 5) {
      throw new Error("Invalid rating");
    }

    if (length <= 0 || !Number.isInteger(length)) {
      throw new Error("Invalid length");
    }

    this.books.push({
      bookId,
      title,
      author,
      genre,
      length,
      description,
      rating,
      ratings: rating ? [rating] : [],
    });
  }

  addUser(userId, name, preferences = {}) {
    const validUserId = S.test(/^\w+$/)(userId); // Ensure userId is a non-empty string of word characters (letters, numbers, underscores)
    const validName = S.test(/^\w+$/)(name); // Ensure name is a non-empty string of word characters
    const validPreferences = S.test(/^\{.*\}$/)(JSON.stringify(preferences)); // Ensure preferences is an object
    if (!validUserId || !validName || !validPreferences || !userId || !name) {
      throw new Error("Book Detail Invalid");
    }

    if (Object.keys(preferences).length > 0) {
      const genre = S.show(preferences.genre);
      const min_length = S.show(preferences.length.min);
      const max_length = S.show(preferences.length.max);
      if (preferences.genre && (S.test(/^\w+$/)(genre) || !preferences.genre)) {
        throw new Error("Book Detail Invalid");
      }

      if (preferences.length) {
        if (
          typeof preferences.length !== "object" ||
          !S.test(/^\d+$/)(min_length) ||
          !S.test(/^\d+$/)(min_length) ||
          preferences.length.min < 0 ||
          preferences.length.max < preferences.length.min
        ) {
          throw new Error("Book Detail Invalid");
        }
      }
    }

    this.users.push({
      userId,
      name,
      preferences,
      readingHistory: [],
    });
  }

  markBookAsRead(userId, bookId) {
    if (typeof userId !== "string" || typeof bookId !== "string") {
      throw new Error("Book Detail Invalid");
    }

    const user = this.users.find((u) => u.userId === userId);
    const book = this.books.find((b) => b.bookId === bookId);

    if (!user || !book) {
      throw new Error("Book Detail Invalid");
    }

    if (!user.readingHistory.includes(bookId)) {
      user.readingHistory.push(bookId);
    }
  }

  getReadingHistory(userId) {
    if (typeof userId !== "string") {
      throw new Error("Book Detail Invalid");
    }

    const user = this.users.find((u) => u.userId === userId);
    if (!user) {
      throw new Error("Book Detail Invalid");
    }

    if (user.readingHistory.length === 0) {
      return "No books read yet";
    }

    return user.readingHistory
      .map((bookId) => {
        const book = this.books.find((b) => b.bookId === bookId);
        return book.title;
      })
      .sort();
  }

  getBooksByGenre(genre) {
    if (typeof genre !== "string") {
      throw new Error("Book Detail Invalid");
    }

    const booksByGenre = this.books
      .filter((b) => b.genre === genre)
      .sort((a, b) => a.bookId.localeCompare(b.bookId));

    if (booksByGenre.length === 0) {
      return "No books found in this genre";
    }

    return booksByGenre;
  }

  getBooksByLength(minLength, maxLength) {
    if (
      typeof minLength !== "number" ||
      typeof maxLength !== "number" ||
      minLength < 0 ||
      maxLength < minLength
    ) {
      throw new Error("Book Detail Invalid");
    }

    const booksByLength = this.books
      .filter((b) => b.length >= minLength && b.length <= maxLength)
      .sort((a, b) => a.length - b.length);

    if (booksByLength.length === 0) {
      return "No books found in the specified length range";
    }

    return booksByLength;
  }

  rateBook(bookId, rating) {
    if (typeof bookId !== "string" || typeof rating !== "number") {
      throw new Error("Book Detail Invalid");
    }

    if (rating < 0 || rating > 5) {
      throw new Error("Book Detail Invalid");
    }

    const book = this.books.find((b) => b.bookId === bookId);
    if (!book) {
      throw new Error("Book Detail Invalid");
    }

    book.ratings.push(rating);
    book.rating =
      book.ratings.reduce((acc, rate) => acc + rate, 0) / book.ratings.length;
  }

  getBooksByAuthor(author) {
    if (typeof author !== "string") {
      throw new Error("Book Detail Invalid");
    }

    const booksByAuthor = this.books
      .filter((b) => b.author === author)
      .sort((a, b) => a.bookId.localeCompare(b.bookId));

    if (booksByAuthor.length === 0) {
      return "No books found by this author";
    }

    return booksByAuthor;
  }

  getTopRatedBooks() {
    const ratedBooks = this.books
      .filter((b) => b.ratings.length > 0)
      .sort((a, b) => b.rating - a.rating);

    if (ratedBooks.length === 0) {
      return "No rated books available";
    }

    return ratedBooks;
  }
}

module.exports = { BookRecommendationSystem };