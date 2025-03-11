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