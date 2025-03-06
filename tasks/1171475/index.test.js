const { createDatasetManager } = require('./correct');

describe("createDatasetManager", () => {
  test("applies single filter", () => {
    const data = [
      { id: 1, category: "book", price: 12 },
      { id: 2, category: "book", price: 5 },
      { id: 3, category: "toy", price: 7 },
      { id: 4, category: "book", price: 8 },
      { id: 5, category: "toy", price: 15 }
    ];

    const result = createDatasetManager(data)
      .filterBy(item => item.category === "toy")
      .execute();

    expect(result).toEqual([
      { id: 3, category: "toy", price: 7 },
      { id: 5, category: "toy", price: 15 }
    ]);
  });

  test("applies multiple filters in sequence", () => {
    const data = [
      { id: 1, category: "book", price: 12 },
      { id: 2, category: "book", price: 5 },
      { id: 3, category: "toy",  price: 7 },
      { id: 4, category: "book", price: 8 },
      { id: 5, category: "toy",  price: 15 }
    ];

    const result = createDatasetManager(data)
      .filterBy(item => item.category === "book")
      .filterBy(item => item.price >= 10)
      .execute();

    expect(result).toEqual([
      { id: 1, category: "book", price: 12 }
    ]);
  });

  test("sorts data by key and order", () => {
    const data = [
      { id: 1, category: "book", price: 12 },
      { id: 2, category: "book", price: 5 },
      { id: 3, category: "toy",  price: 7 }
    ];

    const result = createDatasetManager(data)
      .sortBy("price", "desc")
      .execute();

    expect(result).toEqual([
      { id: 1, category: "book", price: 12 },
      { id: 3, category: "toy",  price: 7 },
      { id: 2, category: "book", price: 5 }
    ]);
  });

  test("groups data by a specific key", () => {
    const data = [
      { id: 1, category: "book", price: 12 },
      { id: 2, category: "book", price: 5 },
      { id: 3, category: "toy",  price: 7 },
      { id: 4, category: "book", price: 8 },
      { id: 5, category: "toy",  price: 15 }
    ];

    const result = createDatasetManager(data)
      .groupBy("category")
      .execute();

    expect(result).toEqual({
      book: [
        { id: 1, category: "book", price: 12 },
        { id: 2, category: "book", price: 5 },
        { id: 4, category: "book", price: 8 }
      ],
      toy: [
        { id: 3, category: "toy", price: 7 },
        { id: 5, category: "toy", price: 15 }
      ]
    });
  });

  test("applies limit on final dataset (no grouping)", () => {
    const data = [
      { id: 1, price: 12 },
      { id: 2, price: 5 },
      { id: 3, price: 7 },
      { id: 4, price: 8 },
      { id: 5, price: 15 }
    ];

    const result = createDatasetManager(data)
      .limit(2)
      .execute();

    expect(result).toEqual([
      { id: 1, price: 12 },
      { id: 2, price: 5 }
    ]);
  });

  test("applies limit within each group (if that is the intended behavior)", () => {
    const data = [
      { id: 1, category: "book", price: 12 },
      { id: 2, category: "book", price: 5 },
      { id: 3, category: "toy",  price: 7 },
      { id: 4, category: "book", price: 8 },
      { id: 5, category: "toy",  price: 15 }
    ];

    const result = createDatasetManager(data)
      .groupBy("category")
      .limit(2)
      .execute();

    // Expect each group to have at most 2 items
    expect(result).toEqual({
      book: [
        { id: 1, category: "book", price: 12 },
        { id: 2, category: "book", price: 5 }
      ],
      toy: [
        { id: 3, category: "toy", price: 7 },
        { id: 5, category: "toy", price: 15 }
      ]
    });
  });

  test("applies filter, then sort, then limit, then group", () => {
    const data = [
      { id: 1, category: "book", price: 12 },
      { id: 2, category: "book", price: 5 },
      { id: 3, category: "toy",  price: 7 },
      { id: 4, category: "book", price: 8 },
      { id: 5, category: "toy",  price: 15 }
    ];

    const result = createDatasetManager(data)
      .filterBy(item => item.price >= 7)
      .sortBy("price", "desc")
      .limit(2)
      .groupBy("category")
      .execute();

    expect(result).toEqual({
      toy: [
        { id: 5, category: "toy", price: 15 }
      ],
      book: [
        { id: 1, category: "book", price: 12 }
      ]
    });
  });

  test("does not mutate the original dataset", () => {
    const originalData = [
      { id: 1, category: "book", price: 12 },
      { id: 2, category: "book", price: 5 }
    ];

    const manager = createDatasetManager(originalData);
    manager.filterBy(item => item.price > 10).execute();

    expect(originalData).toEqual([
      { id: 1, category: "book", price: 12 },
      { id: 2, category: "book", price: 5 }
    ]);
  });


  test("applies filter, then sort, then limit, then group", () => {
    const data = [
      { id: 5, category: "toy",  price: 15 },
      { id: 1, category: "book", price: 12 }
    ];

    const result = createDatasetManager(data)
      .sortBy("price", "desc")
      .limit(2)
      .filterBy(item => item.category == "toy")
      .execute();

    expect(result).toEqual({
      toy: [
        { id: 5, category: "toy", price: 15 }
      ],
      book: [
        { id: 1, category: "book", price: 12 }
      ]
    });
  });
});
