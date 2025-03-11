Base Code:
```javascript
const S = require("sanctuary");
const { Maybe, is } = S;

class BookRecommendationSystem {
  constructor() {
    this.books = [];
    this.users = [];
  }

  // Function to add a new book to the catalog
  addBook(bookId, title, author, genre, length, description, rating) {
    if (
      !bookId ||
      !title ||
      !author ||
      !genre ||
      !description ||
      typeof length !== "number" ||
      typeof rating !== "number"
    ) {
      throw new Error("Book Detail Invalid");
    }

    if (rating < 0 || rating > 5) throw new Error("Invalid rating");
    if (length <= 0 || !Number.isInteger(length))
      throw new Error("Invalid length");

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

  // Function to add a new user to the system
  addUser(userId, name, preferences = {}) {
    if (!userId || !name || typeof preferences !== "object") {
      throw new Error("Book Detail Invalid");
    }

    const validPreferences =
      S.is(Object)(preferences) &&
      (!preferences.genre || S.is(String)(preferences.genre)) &&
      (!preferences.length ||
        (S.is(Object)(preferences.length) &&
          S.is(Number)(preferences.length.min) &&
          S.is(Number)(preferences.length.max)));

    if (!validPreferences) {
      throw new Error("Book Detail Invalid");
    }

    this.users.push({ userId, name, preferences, readingHistory: [] });
  }

  // Function to mark a book as read by the user
  markBookAsRead(userId, bookId) {
    const user = this.users.find((u) => u.userId === userId);
    if (!user) throw new Error("Book Detail Invalid");

    if (!user.readingHistory.includes(bookId)) {
      user.readingHistory.push(bookId);
    }
  }

  // Function to get a user's reading history
  getReadingHistory(userId) {
    const user = this.users.find((u) => u.userId === userId);
    if (!user) throw new Error("Book Detail Invalid");

    if (user.readingHistory.length === 0) {
      return "No books read yet";
    }

    return user.readingHistory
      .map((bookId) => this.books.find((b) => b.bookId === bookId).title)
      .sort();
  }

  // Function to get books by genre
  getBooksByGenre(genre) {
    const booksByGenre = this.books
      .filter((b) => b.genre === genre)
      .sort((a, b) => a.bookId.localeCompare(b.bookId));

    if (booksByGenre.length === 0) {
      return "No books found in this genre";
    }

    return booksByGenre;
  }

  // Function to get books within a specific length range
  getBooksByLength(minLength, maxLength) {
    if (typeof minLength !== "number" || typeof maxLength !== "number") {
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

  // Function to rate a book
  rateBook(bookId, rating) {
    if (typeof rating !== "number" || rating < 0 || rating > 5)
      throw new Error("Invalid rating");

    const book = this.books.find((b) => b.bookId === bookId);
    if (!book) throw new Error("Book Detail Invalid");

    book.ratings.push(rating);
    book.rating =
      book.ratings.reduce((acc, rate) => acc + rate, 0) / book.ratings.length;
  }

  // Function to get books based on author
  getBooksByAuthor(author) {
    const booksByAuthor = this.books
      .filter((b) => b.author === author)
      .sort((a, b) => a.bookId.localeCompare(b.bookId));

    if (booksByAuthor.length === 0) {
      return "No books found by this author";
    }

    return booksByAuthor;
  }

  // Function to get top-rated books
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


```

Stack Trace:
```javascript
BookRecommendationSystem
    ✓ should add a new book to the catalog (1 ms)
    ✓ should throw an error when adding a book with invalid details (8 ms)
    ✓ should throw an error when adding a book with invalid rating
    ✓ should throw an error when adding a book with invalid rating (1 ms)
    ✕ should add a new user to the system (1 ms)
    ✕ should throw an error when adding a user with invalid details (13 ms)
    ✕ should throw an error when adding a user with invalid details ir prefernce having invalid genera (2 ms)
    ✕ should mark a book as read for a user (1 ms)
    ✕ should throw an error if the user or book does not exist
    ✕ should get reading history for a user
    ✕ should return "No books read yet" if the user has no books in history
    ✕ should throw error if the user provided is invalid type
    ✓ should get books by genre (1 ms)
    ✓ should return "No books found in this genre" when no books match the genre
    ✕ should throw error if genre is of invalid type in getBookByGenre
    ✓ should get books within a specific length range (1 ms)
    ✓ should return "No books found in the specified length range" when no books match the length range
    ✕ should rate a book
    ✕ should throw an error when rating a book with invalid rating (1 ms)
    ✓ should get books by author
    ✓ should return "No books found by this author" when no books match the author
    ✕ should get top-rated books (1 ms)
    ✕ should return "No rated books available" when no books have a rating

  ● BookRecommendationSystem › should add a new user to the system

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function Object() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      45 |
      46 |     const validPreferences =
    > 47 |       S.is(Object)(preferences) &&
         |         ^
      48 |       (!preferences.genre || S.is(String)(preferences.genre)) &&
      49 |       (!preferences.length ||
      50 |         (S.is(Object)(preferences.length) &&

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at BookRecommendationSystem.is [as addUser] (Solution.js:47:9)
      at Object.addUser (WordCloud.test.js:61:12)

  ● BookRecommendationSystem › should throw an error when adding a user with invalid details

    expect(received).toThrow(expected)

    Expected substring: "Book Detail Invalid"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function Object() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          45 |
          46 |     const validPreferences =
        > 47 |       S.is(Object)(preferences) &&
             |         ^
          48 |       (!preferences.genre || S.is(String)(preferences.genre)) &&
          49 |       (!preferences.length ||
          50 |         (S.is(Object)(preferences.length) &&

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at BookRecommendationSystem.is [as addUser] (Solution.js:47:9)
          at addUser (WordCloud.test.js:72:14)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:76:7)

      74 |         length: { min: -1, max: 500 },
      75 |       })
    > 76 |     ).toThrow("Book Detail Invalid");
         |       ^
      77 |   });
      78 |
      79 |   test("should throw an error when adding a user with invalid details ir prefernce having invalid genera", () => {

      at Object.toThrow (WordCloud.test.js:76:7)

  ● BookRecommendationSystem › should throw an error when adding a user with invalid details ir prefernce having invalid genera

    expect(received).toThrow(expected)

    Expected substring: "Book Detail Invalid"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function Object() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          45 |
          46 |     const validPreferences =
        > 47 |       S.is(Object)(preferences) &&
             |         ^
          48 |       (!preferences.genre || S.is(String)(preferences.genre)) &&
          49 |       (!preferences.length ||
          50 |         (S.is(Object)(preferences.length) &&

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at BookRecommendationSystem.is [as addUser] (Solution.js:47:9)
          at addUser (WordCloud.test.js:82:14)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:86:7)

      84 |         length: { min: -1, max: 500 },
      85 |       })
    > 86 |     ).toThrow("Book Detail Invalid");
         |       ^
      87 |   });
      88 |
      89 |   // Test: Mark Book as Read

      at Object.toThrow (WordCloud.test.js:86:7)

  ● BookRecommendationSystem › should mark a book as read for a user

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function Object() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      45 |
      46 |     const validPreferences =
    > 47 |       S.is(Object)(preferences) &&
         |         ^
      48 |       (!preferences.genre || S.is(String)(preferences.genre)) &&
      49 |       (!preferences.length ||
      50 |         (S.is(Object)(preferences.length) &&

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at BookRecommendationSystem.is [as addUser] (Solution.js:47:9)
      at Object.addUser (WordCloud.test.js:100:12)

  ● BookRecommendationSystem › should throw an error if the user or book does not exist

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function Object() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      45 |
      46 |     const validPreferences =
    > 47 |       S.is(Object)(preferences) &&
         |         ^
      48 |       (!preferences.genre || S.is(String)(preferences.genre)) &&
      49 |       (!preferences.length ||
      50 |         (S.is(Object)(preferences.length) &&

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at BookRecommendationSystem.is [as addUser] (Solution.js:47:9)
      at Object.addUser (WordCloud.test.js:115:12)

  ● BookRecommendationSystem › should get reading history for a user

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function Object() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      45 |
      46 |     const validPreferences =
    > 47 |       S.is(Object)(preferences) &&
         |         ^
      48 |       (!preferences.genre || S.is(String)(preferences.genre)) &&
      49 |       (!preferences.length ||
      50 |         (S.is(Object)(preferences.length) &&

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at BookRecommendationSystem.is [as addUser] (Solution.js:47:9)
      at Object.addUser (WordCloud.test.js:135:12)

  ● BookRecommendationSystem › should return "No books read yet" if the user has no books in history

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function Object() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      45 |
      46 |     const validPreferences =
    > 47 |       S.is(Object)(preferences) &&
         |         ^
      48 |       (!preferences.genre || S.is(String)(preferences.genre)) &&
      49 |       (!preferences.length ||
      50 |         (S.is(Object)(preferences.length) &&

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at BookRecommendationSystem.is [as addUser] (Solution.js:47:9)
      at Object.addUser (WordCloud.test.js:142:12)

  ● BookRecommendationSystem › should throw error if the user provided is invalid type

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function Object() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      45 |
      46 |     const validPreferences =
    > 47 |       S.is(Object)(preferences) &&
         |         ^
      48 |       (!preferences.genre || S.is(String)(preferences.genre)) &&
      49 |       (!preferences.length ||
      50 |         (S.is(Object)(preferences.length) &&

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at BookRecommendationSystem.is [as addUser] (Solution.js:47:9)
      at Object.addUser (WordCloud.test.js:148:12)

  ● BookRecommendationSystem › should throw error if genre is of invalid type in getBookByGenre

    expect(received).toThrow(expected)

    Expected substring: "Book Detail Invalid"

    Received function did not throw

      190 |
      191 |   test("should throw error if genre is of invalid type in getBookByGenre", () => {
    > 192 |     expect(() => system.getBooksByGenre(123)).toThrow("Book Detail Invalid");
          |                                               ^
      193 |   });
      194 |
      195 |   // Test: Get Books by Length

      at Object.toThrow (WordCloud.test.js:192:47)

  ● BookRecommendationSystem › should rate a book

    Book Detail Invalid

      19 |       typeof rating !== "number"
      20 |     ) {
    > 21 |       throw new Error("Book Detail Invalid");
         |             ^
      22 |     }
      23 |
      24 |     if (rating < 0 || rating > 5) throw new Error("Invalid rating");

      at BookRecommendationSystem.addBook (Solution.js:21:13)
      at Object.addBook (WordCloud.test.js:236:12)

  ● BookRecommendationSystem › should throw an error when rating a book with invalid rating

    expect(received).toThrow(expected)

    Expected substring: "Book Detail Invalid"
    Received message:   "Invalid rating"

          116 |   rateBook(bookId, rating) {
          117 |     if (typeof rating !== "number" || rating < 0 || rating > 5)
        > 118 |       throw new Error("Invalid rating");
              |             ^
          119 |
          120 |     const book = this.books.find((b) => b.bookId === bookId);
          121 |     if (!book) throw new Error("Book Detail Invalid");

          at BookRecommendationSystem.rateBook (Solution.js:118:13)
          at rateBook (WordCloud.test.js:258:25)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:258:43)

      256 |       4.5
      257 |     );
    > 258 |     expect(() => system.rateBook("1", 6)).toThrow("Book Detail Invalid");
          |                                           ^
      259 |     expect(() => system.rateBook("1", -1)).toThrow("Book Detail Invalid");
      260 |   });
      261 |

      at Object.toThrow (WordCloud.test.js:258:43)

  ● BookRecommendationSystem › should get top-rated books

    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: 24

      321 |     );
      322 |     const topBooks = system.getTopRatedBooks();
    > 323 |     expect(topBooks.length).toBe(2);
          |                             ^
      324 |     expect(topBooks[0].rating).toBe(4.8);
      325 |   });
      326 |

      at Object.toBe (WordCloud.test.js:323:29)

  ● BookRecommendationSystem › should return "No rated books available" when no books have a rating

    Book Detail Invalid

      19 |       typeof rating !== "number"
      20 |     ) {
    > 21 |       throw new Error("Book Detail Invalid");
         |             ^
      22 |     }
      23 |
      24 |     if (rating < 0 || rating > 5) throw new Error("Invalid rating");

      at BookRecommendationSystem.addBook (Solution.js:21:13)
      at Object.addBook (WordCloud.test.js:328:12)

Test Suites: 1 failed, 1 total
Tests:       13 failed, 10 passed, 23 total
Snapshots:   0 total
Time:        0.286 s, estimated 1 s
Ran all test suites.
```

	
Prompt:
Please fix the bugs in the code based on the details below:


Function: `addBook`
    -   `bookId` (string) – Unique identifier for the book.
    -   `title` (string) – Title of the book.
    -   `author` (string) – Author of the book.
    -   `genre` (string) – Genre of the book (e.g., "Mystery", "Fantasy").
    -   `length` (number) – Length of the book in pages.
    -   `description` (string) – A short description of the book.
    -   `rating` (number) – Average rating of the book (0-5 scale), optional.
    -   Ensure `rating` is a number between 0 and 5. If invalid, throw an error: `"Invalid rating"`.
    -   Ensure `length` is a positive integer. If invalid, throw an error: `"Invalid length"`.
    -   Store the book in the system’s catalog.


Function: `addUser`
   -   `userId` (string) – Unique identifier for the user.
    -   `name` (string) – Name of the user.
    -   `preferences` (object, optional) – An object containing the user’s preferences. For example, `{ genre: "Fantasy", length: { min: 100, max: 500 }}`.
    -   Ensure `preferences` is a valid object or empty. If provided, validate genre, length as defined in addBook.
    -   Store the user with their preferences in the system.


Function: `markBookAsRead`
   -   `userId` (string)
    -   `bookId` (string)
    -   Add the book to the user’s reading history.

Function: `getReadingHistory`
    -   `userId` (string)
    -   Return an array of book titles the user has read, sorted by titles (ascending).
    -   If the user has not read any books, return `"No books read yet"`.


Function: `getBooksByGenre`

   -   `genre` (string) – The genre of the books.
    -   Return all books in the system that belong to the specified genre, sorted by bookId (ascending).
    -   If no books belong to the specified genre, return `"No books found in this genre"`.


Function: `getBooksByLength`

   -   `minLength` (number) – Minimum length of the book (in pages).
   -   `maxLength` (number) – Maximum length of the book (in pages).
    -   Return books that fall within the specified length range , sorted by length(ascending).
    -   If no books match the length criteria, return `"No books found in the specified length range"`.

Function: `rateBook`
   -   `bookId` (string) – The book to rate.
   -   `rating` (number) – The rating (0-5).
    -   Ensure `rating` is between 0 and 5. If invalid, throw an error: `"Invalid rating"`.
    -   Update the book’s rating and store the average rating for the book.


Function: `getBooksByAuthor`
  -   `author` (string) – The author’s name.
  -   Return all books written by the specified author sorted by bookId (ascending).
   -   If no books are found by the author, return `"No books found by this author"`.

Function: `getTopRatedBooks`
    -   Return an array of the top-rated books in the system (sorted by rating) (descending).
    -   If no books are rated, return `"No rated books available"`.




Note: 
- If any parameter passed to the above functions is missing or invalid type then raise error "Book Detail Invalid"