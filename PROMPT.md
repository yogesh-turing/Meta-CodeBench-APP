Base Code:
```javascript
const { List, Map } = require("immutable");

class RecipeManagementSystem {
  constructor() {
    this.recipes = List();
  }

  addRecipe(recipeId, name, ingredients, instructions, prepTime, cookTime) {
    if (
      !Array.isArray(ingredients) ||
      !ingredients.every(
        (ing) =>
          typeof ing.name === "string" &&
          (typeof ing.amount === "string" || typeof ing.amount === "number")
      )
    ) {
      throw new Error("Invalid ingredients");
    }

    if (typeof instructions !== "string" || instructions.trim() === "") {
      throw new Error("Instructions cannot be empty");
    }

    const newRecipe = Map({
      recipeId,
      name,
      ingredients: List(ingredients),
      instructions,
      prepTime,
      cookTime,
    });

    this.recipes = this.recipes.push(newRecipe);
  }

  updateRecipe(recipeId, updatedDetails) {
    const recipeIndex = this.recipes.findIndex(
      (recipe) => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    const updatedRecipe = this.recipes.get(recipeIndex);

    // Validate updated details
    const { ingredients, instructions, prepTime, cookTime } =
      updatedRecipe.toObject();

    if (
      (prepTime !== undefined &&
        (!Number.isInteger(prepTime) || prepTime < 0)) ||
      (cookTime !== undefined && (!Number.isInteger(cookTime) || cookTime < 0))
    ) {
      throw new Error("Time must be a non-negative number");
    }

    if (
      ingredients &&
      (!Array.isArray(ingredients) ||
        !ingredients.every(
          (ing) =>
            typeof ing.name === "string" &&
            (typeof ing.amount === "string" || typeof ing.amount === "number")
        ))
    ) {
      throw new Error("Invalid ingredients");
    }

    if (
      instructions !== undefined &&
      (typeof instructions !== "string" || instructions.trim() === "")
    ) {
      throw new Error("Instructions cannot be empty");
    }

    this.recipes = this.recipes.set(updatedRecipe, recipeIndex);
  }

  // Function to get a recipe by its ID
  getRecipeById(recipeId) {
    if (typeof recipeId !== "string" && recipeId.trim() === "") {
      throw new Error("Invalid recipe details");
    }

    const recipe = this.recipes.find(
      (recipe) => recipe.get("recipeId") === recipeId
    );

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipe.toObject();
  }

  // Function to generate a report of all recipes
  generateRecipeReport() {
    return this.recipes
      .map((recipe) => ({
        recipeId: recipe.get("recipeId"),
        name: recipe.get("name"),
        prepTime: recipe.get("prepTime"),
      }))
      .toArray();
  }

  // Function to delete a recipe
  deleteRecipe(recipeId) {
    const recipeIndex = this.recipes.findIndex(
      (recipe) => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }
  }
}

module.exports = { RecipeManagementSystem };

```


Stack Trace:
```javascript
RecipeManagementSystem
    ✕ should add a new recipe (3 ms)
    ✕ should throw error if adding recipe with negative time
    ✓ should throw error if adding recipe with empty description (2 ms)
    ✓ should throw error if adding recipe with invalid ingredients
    ✓ should throw error if recipeId not found in getRecipeById (1 ms)
    ✕ should update a recipe
    ✕ should throw error of updating recipe with same reciepe details (10 ms)
    ✓ should throw error if updating recipe not found (1 ms)
    ✕ should throw error if updating recipe but reciepe ID parameter is missing (2 ms)
    ✕ should throw error if updating recipe but updatedDetails object is missing (3 ms)
    ✓ should throw error if updating recipe but updatedDetails object has invalid ingredients (1 ms)
    ✕ should throw error if updating recipe but updatedDetails object preptime cannot be negative (1 ms)
    ✕ should throw error if updating recipe but updatedDetails object cooktime cannot be negative (1 ms)
    ✕ should throw error if updating recipe but updatedDetails object description is empty (1 ms)
    ✓ should generate recipe report
    ✓ should throw error if deleting recipe that does not exist
    ✕ should delete a recipe

  ● RecipeManagementSystem › should add a new recipe

    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: undefined

      23 |     const recipe = recipeSystem.getRecipeById("1");
      24 |     expect(recipe.name).toBe("Vegetarian Tacos");
    > 25 |     expect(recipe.ingredients.length).toBe(2);
         |                                       ^
      26 |     expect(recipe.prepTime).toBe(15);
      27 |     expect(recipe.cookTime).toBe(10);
      28 |   });

      at Object.toBe (WordCloud.test.js:25:39)

  ● RecipeManagementSystem › should throw error if adding recipe with negative time

    expect(received).toThrowError(expected)

    Expected substring: "Time must be a non-negative number"

    Received function did not throw

      38 |         20
      39 |       );
    > 40 |     }).toThrowError("Time must be a non-negative number");
         |        ^
      41 |   });
      42 |
      43 |   test("should throw error if adding recipe with empty description", () => {

      at Object.toThrowError (WordCloud.test.js:40:8)

  ● RecipeManagementSystem › should update a recipe

    Invalid ingredients

      66 |         ))
      67 |     ) {
    > 68 |       throw new Error("Invalid ingredients");
         |             ^
      69 |     }
      70 |
      71 |     if (

      at RecipeManagementSystem.updateRecipe (Solution.js:68:13)
      at Object.updateRecipe (WordCloud.test.js:88:18)

  ● RecipeManagementSystem › should throw error of updating recipe with same reciepe details

    expect(received).toThrowError(expected)

    Expected substring: "Same recipe object"
    Received message:   "Invalid ingredients"

          66 |         ))
          67 |     ) {
        > 68 |       throw new Error("Invalid ingredients");
             |             ^
          69 |     }
          70 |
          71 |     if (

          at RecipeManagementSystem.updateRecipe (Solution.js:68:13)
          at updateRecipe (WordCloud.test.js:108:20)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:117:8)

      115 |         cookTime: 15,
      116 |       });
    > 117 |     }).toThrowError("Same recipe object");
          |        ^
      118 |
      119 |     const updatedRecipe = recipeSystem.getRecipeById("4");
      120 |     expect(updatedRecipe.prepTime).toBe(12);

      at Object.toThrowError (WordCloud.test.js:117:8)

  ● RecipeManagementSystem › should throw error if updating recipe but reciepe ID parameter is missing

    expect(received).toThrowError(expected)

    Expected substring: "Invalid recipe details"
    Received message:   "Recipe not found"

          40 |
          41 |     if (recipeIndex === -1) {
        > 42 |       throw new Error("Recipe not found");
             |             ^
          43 |     }
          44 |
          45 |     const updatedRecipe = this.recipes.get(recipeIndex);

          at RecipeManagementSystem.updateRecipe (Solution.js:42:13)
          at updateRecipe (WordCloud.test.js:132:20)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:133:8)

      131 |     expect(() => {
      132 |       recipeSystem.updateRecipe({ prepTime: 10 });
    > 133 |     }).toThrowError("Invalid recipe details");
          |        ^
      134 |   });
      135 |
      136 |   test("should throw error if updating recipe but updatedDetails object is missing", () => {

      at Object.toThrowError (WordCloud.test.js:133:8)

  ● RecipeManagementSystem › should throw error if updating recipe but updatedDetails object is missing

    expect(received).toThrowError(expected)

    Expected substring: "Invalid recipe details"
    Received message:   "Invalid ingredients"

          66 |         ))
          67 |     ) {
        > 68 |       throw new Error("Invalid ingredients");
             |             ^
          69 |     }
          70 |
          71 |     if (

          at RecipeManagementSystem.updateRecipe (Solution.js:68:13)
          at updateRecipe (WordCloud.test.js:149:20)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:150:8)

      148 |     expect(() => {
      149 |       recipeSystem.updateRecipe("4");
    > 150 |     }).toThrowError("Invalid recipe details");
          |        ^
      151 |   });
      152 |
      153 |   test("should throw error if updating recipe but updatedDetails object has invalid ingredients", () => {

      at Object.toThrowError (WordCloud.test.js:150:8)

  ● RecipeManagementSystem › should throw error if updating recipe but updatedDetails object preptime cannot be negative

    expect(received).toThrowError(expected)

    Expected substring: "Time must be a non-negative number"
    Received message:   "Invalid ingredients"

          66 |         ))
          67 |     ) {
        > 68 |       throw new Error("Invalid ingredients");
             |             ^
          69 |     }
          70 |
          71 |     if (

          at RecipeManagementSystem.updateRecipe (Solution.js:68:13)
          at updateRecipe (WordCloud.test.js:183:20)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:184:8)

      182 |     expect(() => {
      183 |       recipeSystem.updateRecipe("4", { prepTime: -12 });
    > 184 |     }).toThrowError("Time must be a non-negative number");
          |        ^
      185 |   });
      186 |
      187 |   test("should throw error if updating recipe but updatedDetails object cooktime cannot be negative", () => {

      at Object.toThrowError (WordCloud.test.js:184:8)

  ● RecipeManagementSystem › should throw error if updating recipe but updatedDetails object cooktime cannot be negative

    expect(received).toThrowError(expected)

    Expected substring: "Time must be a non-negative number"
    Received message:   "Invalid ingredients"

          66 |         ))
          67 |     ) {
        > 68 |       throw new Error("Invalid ingredients");
             |             ^
          69 |     }
          70 |
          71 |     if (

          at RecipeManagementSystem.updateRecipe (Solution.js:68:13)
          at updateRecipe (WordCloud.test.js:200:20)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:201:8)

      199 |     expect(() => {
      200 |       recipeSystem.updateRecipe("4", { cookTime: -12 });
    > 201 |     }).toThrowError("Time must be a non-negative number");
          |        ^
      202 |   });
      203 |
      204 |   test("should throw error if updating recipe but updatedDetails object description is empty", () => {

      at Object.toThrowError (WordCloud.test.js:201:8)

  ● RecipeManagementSystem › should throw error if updating recipe but updatedDetails object description is empty

    expect(received).toThrowError(expected)

    Expected substring: "Instructions cannot be empty"
    Received message:   "Invalid ingredients"

          66 |         ))
          67 |     ) {
        > 68 |       throw new Error("Invalid ingredients");
             |             ^
          69 |     }
          70 |
          71 |     if (

          at RecipeManagementSystem.updateRecipe (Solution.js:68:13)
          at updateRecipe (WordCloud.test.js:217:20)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:218:8)

      216 |     expect(() => {
      217 |       recipeSystem.updateRecipe("4", { instructions: "" });
    > 218 |     }).toThrowError("Instructions cannot be empty");
          |        ^
      219 |   });
      220 |
      221 |   test("should generate recipe report", () => {

      at Object.toThrowError (WordCloud.test.js:218:8)

  ● RecipeManagementSystem › should delete a recipe

    expect(received).toThrowError(expected)

    Expected substring: "Recipe not found"

    Received function did not throw

      263 |     expect(() => {
      264 |       recipeSystem.getRecipeById("7");
    > 265 |     }).toThrowError("Recipe not found");
          |        ^
      266 |   });
      267 |
      268 |   // test("should search recipes by ingredient", () => {

      at Object.toThrowError (WordCloud.test.js:265:8)

```

Prompt:

Please fix the bugs as outlined below.

Function: `addRecipe`
    -   `recipeId` (string)
    -   `name` (string) 
    -   `ingredients` (array) – Array of ingredients required for the recipe. Each ingredient is an object with `name` (string) and `amount` (string/number).
    -   `instructions` (string) 
    -   `prepTime` (number) 
    -   `cookTime` (number)
    -   Ensure `prepTime` and `cookTime` are non-negative integers. If invalid, throw an error: `"Time must be a non-negative number"`.
    -   Ensure `ingredients` is an array of objects, each containing a valid `name` and `amount` property. If invalid, throw an error: `"Invalid ingredients"`.
    -   Ensure `instructions` is a non-empty string. If invalid, throw an error: `"Instructions cannot be empty"`.
    -   Store the recipe in an array of recipes.

Function: `updateRecipe`
    -   `recipeId` (string) – ID of the recipe to update.
    -   `updatedDetails` (object) – An object containing the updated recipe details.
    -   If any parameter is missing or invalid, throw an error: `"Invalid recipe details"`.
    -   If the `recipeId` does not exist, throw an error: `"Recipe not found"`.
    -   Update the recipe details based on the `updatedDetails` provided.
   -    If the `updatedDetails` object is same to already existing recipe then raise an error: “Same recipe object”.
    -   Ensure that the updated details respect the same validation rules as `addRecipe`.

Function: `getRecipeById`
    -   `recipeId` (string)
    -   If the `recipeId` is missing or invalid, throw an error: `"Invalid recipe details"`.
    -   If the `recipeId` does not exist, throw an error: `"Recipe not found"`.
    -   Return the recipe's details as an object, including:
        -   `recipeId` (string)
        -   `name` (string)
        -   `ingredients` (array)
        -   `instructions` (string)
        -   `prepTime` (number)
        -   `cookTime` (number)

Function: `generateRecipeReport`
    -   Return an array of recipes with only `recipeId`, `name`, and `prepTime`.
    -   The recipes should be sorted by `prepTime` (lowest prep time first).

Function: `deleteRecipe  
    -   `recipeId` (string)
    -   If the `recipeId` does not exist, throw an error: `"Recipe not found"`.
    -   Delete the recipe from the recipe list.

Note: 
- Don't use any package other than Immutable.