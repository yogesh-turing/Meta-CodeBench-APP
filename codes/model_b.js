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
      typeof rating !== "number"
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
      ratings: [],
    });
  }

  addUser(userId, name, preferences = {}) {
    if (
      typeof userId !== "string" ||
      typeof name !== "string" ||
      typeof preferences !== "object"
    ) {
      throw new Error("Book Detail Invalid");
    }

    if (preferences.genre && typeof preferences.genre !== "string") {
      throw new Error("Book Detail Invalid");
    }

    if (preferences.length) {
      if (
        typeof preferences.length !== "object" ||
        typeof preferences.length.min !== "number" ||
        typeof preferences.length.max !== "number" ||
        preferences.length.min > preferences.length.max
      ) {
        throw new Error("Book Detail Invalid");
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
      minLength > maxLength
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