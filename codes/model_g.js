const { List, Map } = require("immutable");

class RecipeManagementSystem {
  constructor() {
    this.recipes = List();
  }

  // Add a new recipe
  addRecipe(recipeId, name, ingredients, instructions, prepTime, cookTime) {
    if (!recipeId || !name || !Array.isArray(ingredients) || typeof instructions !== "string") {
      throw new Error("Invalid recipe details");
    }

    if (
      !Number.isInteger(prepTime) || prepTime < 0 ||
      !Number.isInteger(cookTime) || cookTime < 0
    ) {
      throw new Error("Time must be a non-negative number");
    }

    if (!ingredients.every(
      (ing) =>
        typeof ing.name === "string" &&
        (typeof ing.amount === "string" || typeof ing.amount === "number")
    )) {
      throw new Error("Invalid ingredients");
    }

    if (instructions.trim() === "") {
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

  // Update an existing recipe
  updateRecipe(recipeId, updatedDetails) {
    if (!recipeId || !updatedDetails) {
      throw new Error("Invalid recipe details");
    }

    const recipeIndex = this.recipes.findIndex(
      (recipe) => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    const currentRecipe = this.recipes.get(recipeIndex);

    // Validate updated details
    const updatedRecipe = currentRecipe.merge(updatedDetails);

    if (currentRecipe.equals(updatedRecipe)) {
      throw new Error("Same recipe object");
    }

    const { ingredients, instructions, prepTime, cookTime } = updatedRecipe.toObject();

    if (
      (prepTime !== undefined && (!Number.isInteger(prepTime) || prepTime < 0)) ||
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

    this.recipes = this.recipes.set(recipeIndex, updatedRecipe);
  }

  // Get a recipe by its ID
  getRecipeById(recipeId) {
    if (typeof recipeId !== "string" || recipeId.trim() === "") {
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

  // Generate a report of all recipes
  generateRecipeReport() {
    return this.recipes
      .map((recipe) => ({
        recipeId: recipe.get("recipeId"),
        name: recipe.get("name"),
        prepTime: recipe.get("prepTime"),
      }))
      .sort((a, b) => a.prepTime - b.prepTime)
      .toArray();
  }

  // Delete a recipe
  deleteRecipe(recipeId) {
    const recipeIndex = this.recipes.findIndex(
      (recipe) => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    this.recipes = this.recipes.delete(recipeIndex);
  }
}

module.exports = { RecipeManagementSystem };