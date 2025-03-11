const { RecipeManagementSystem } = require(process.env.TARGET_FILE);

describe("RecipeManagementSystem", () => {
  let recipeSystem;

  beforeEach(() => {
    recipeSystem = new RecipeManagementSystem();
  });

  test("should add a new recipe", () => {
    recipeSystem.addRecipe(
      "1",
      "Vegetarian Tacos",
      [
        { name: "Taco Shell", amount: 4 },
        { name: "Lettuce", amount: "1 cup" },
      ],
      "Stuff taco shells with lettuce.",
      15,
      10
    );

    const recipe = recipeSystem.getRecipeById("1");
    expect(recipe.name).toBe("Vegetarian Tacos");
    expect(recipe.ingredients.length).toBe(2);
    expect(recipe.prepTime).toBe(15);
    expect(recipe.cookTime).toBe(10);
  });

  test("should throw error if adding recipe with negative time", () => {
    expect(() => {
      recipeSystem.addRecipe(
        "2",
        "Vegan Burger",
        [{ name: "Bun", amount: 2 }],
        "Grill the buns.",
        -10,
        20
      );
    }).toThrowError("Time must be a non-negative number");
  });

  test("should throw error if adding recipe with empty description", () => {
    expect(() => {
      recipeSystem.addRecipe(
        "2",
        "Vegan Burger",
        [{ name: "Bun", amount: 2 }],
        "",
        10,
        20
      );
    }).toThrowError("Instructions cannot be empty");
  });

  test("should throw error if adding recipe with invalid ingredients", () => {
    expect(() => {
      recipeSystem.addRecipe(
        "3",
        "Cheese Pizza",
        [{ name: "Cheese", amount: 1 }, { name: "Dough" }],
        "Bake the pizza.",
        10,
        15
      );
    }).toThrowError("Invalid ingredients");
  });

  test("should throw error if recipeId not found in getRecipeById", () => {
    expect(() => {
      recipeSystem.getRecipeById("nonexistent");
    }).toThrowError("Recipe not found");
  });

  test("should update a recipe", () => {
    recipeSystem.addRecipe(
      "4",
      "Spaghetti",
      [
        { name: "Pasta", amount: "200g" },
        { name: "Tomato Sauce", amount: "1 cup" },
      ],
      "Cook the pasta, then add sauce.",
      10,
      15
    );

    recipeSystem.updateRecipe("4", { prepTime: 12, cookTime: 18 });

    const updatedRecipe = recipeSystem.getRecipeById("4");
    expect(updatedRecipe.prepTime).toBe(12);
    expect(updatedRecipe.cookTime).toBe(18);
  });

  test("should throw error of updating recipe with same reciepe details", () => {
    recipeSystem.addRecipe(
      "4",
      "Spaghetti",
      [
        { name: "Pasta", amount: "200g" },
        { name: "Tomato Sauce", amount: "1 cup" },
      ],
      "Cook the pasta, then add sauce.",
      10,
      15
    );
    expect(() => {
      recipeSystem.updateRecipe("4", {
        name: "Spaghetti",
        ingredients: [
          { name: "Pasta", amount: "200g" },
          { name: "Tomato Sauce", amount: "1 cup" },
        ],
        prepTime: 10,
        cookTime: 15,
      });
    }).toThrowError("Same recipe object");
  });

  test("should throw error if updating recipe not found", () => {
    expect(() => {
      recipeSystem.updateRecipe("nonexistent", { prepTime: 10 });
    }).toThrowError("Recipe not found");
  });

  test("should throw error if updating recipe but reciepe ID parameter is missing", () => {
    expect(() => {
      recipeSystem.updateRecipe({ prepTime: 10 });
    }).toThrowError("Invalid recipe details");
  });

  test("should throw error if updating recipe but updatedDetails object is missing", () => {
    recipeSystem.addRecipe(
      "4",
      "Spaghetti",
      [
        { name: "Pasta", amount: "200g" },
        { name: "Tomato Sauce", amount: "1 cup" },
      ],
      "Cook the pasta, then add sauce.",
      10,
      15
    );
    expect(() => {
      recipeSystem.updateRecipe("4");
    }).toThrowError("Invalid recipe details");
  });

  test("should throw error if updating recipe but updatedDetails object has invalid ingredients", () => {
    recipeSystem.addRecipe(
      "4",
      "Spaghetti",
      [
        { name: "Pasta", amount: "200g" },
        { name: "Tomato Sauce", amount: "1 cup" },
      ],
      "Cook the pasta, then add sauce.",
      10,
      15
    );
    expect(() => {
      recipeSystem.updateRecipe("4", { ingredients: [{ name: "Past" }] });
    }).toThrowError("Invalid ingredients");
  });

  test("should throw error if updating recipe but updatedDetails object preptime cannot be negative", () => {
    recipeSystem.addRecipe(
      "4",
      "Spaghetti",
      [
        { name: "Pasta", amount: "200g" },
        { name: "Tomato Sauce", amount: "1 cup" },
      ],
      "Cook the pasta, then add sauce.",
      10,
      15
    );
    expect(() => {
      recipeSystem.updateRecipe("4", { prepTime: -12 });
    }).toThrowError("Time must be a non-negative number");
  });

  test("should throw error if updating recipe but updatedDetails object cooktime cannot be negative", () => {
    recipeSystem.addRecipe(
      "4",
      "Spaghetti",
      [
        { name: "Pasta", amount: "200g" },
        { name: "Tomato Sauce", amount: "1 cup" },
      ],
      "Cook the pasta, then add sauce.",
      10,
      15
    );
    expect(() => {
      recipeSystem.updateRecipe("4", { cookTime: -12 });
    }).toThrowError("Time must be a non-negative number");
  });

  test("should throw error if updating recipe but updatedDetails object description is empty", () => {
    recipeSystem.addRecipe(
      "4",
      "Spaghetti",
      [
        { name: "Pasta", amount: "200g" },
        { name: "Tomato Sauce", amount: "1 cup" },
      ],
      "Cook the pasta, then add sauce.",
      10,
      15
    );
    expect(() => {
      recipeSystem.updateRecipe("4", { instructions: "" });
    }).toThrowError("Instructions cannot be empty");
  });

  test("should generate recipe report", () => {
    recipeSystem.addRecipe(
      "5",
      "Fried Rice",
      [{ name: "Rice", amount: "2 cups" }],
      "Fry rice with vegetables.",
      5,
      15
    );
    recipeSystem.addRecipe(
      "6",
      "Omelette",
      [{ name: "Eggs", amount: 3 }],
      "Beat eggs and cook.",
      5,
      5
    );

    const report = recipeSystem.generateRecipeReport();
    expect(report.length).toBe(2);
    expect(report[0].prepTime).toBe(5);
    expect(report[1].prepTime).toBe(5);
  });

  test("should throw error if deleting recipe that does not exist", () => {
    expect(() => {
      recipeSystem.deleteRecipe("nonexistent");
    }).toThrowError("Recipe not found");
  });

  test("should delete a recipe", () => {
    recipeSystem.addRecipe(
      "7",
      "Pancakes",
      [{ name: "Flour", amount: "1 cup" }],
      "Mix ingredients and cook.",
      10,
      5
    );

    recipeSystem.deleteRecipe("7");

    expect(() => {
      recipeSystem.getRecipeById("7");
    }).toThrowError("Recipe not found");
  });

 
});