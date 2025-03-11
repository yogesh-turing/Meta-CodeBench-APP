const { List, Map } = require("immutable");

class RecipeManagementSystem {
  constructor() {
    this.recipes = List();
  }

  addRecipe(recipeId, name, ingredients, instructions, prepTime, cookTime) {
    // Validate inputs
    if (typeof recipeId !== "string" || recipeId.trim() === "") {
      throw new Error("Invalid recipe details");
    }

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("Invalid recipe details");
    }

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

    if (
      !Number.isInteger(prepTime) ||
      prepTime < 0 ||
      !Number.isInteger(cookTime) ||
      cookTime < 0
    ) {
      throw new Error("Time must be a non-negative number");
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
    // Validate inputs
    if (!recipeId || typeof recipeId !== "string" || !updatedDetails || typeof updatedDetails !== "object") {
      throw new Error("Invalid recipe details");
    }

    const recipeIndex = this.recipes.findIndex(
      (recipe) => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    const originalRecipe = this.recipes.get(recipeIndex);

    const updatedRecipe = originalRecipe.merge(updatedDetails);

    if (originalRecipe.equals(updatedRecipe)) {
      throw new Error("Same recipe object");
    }

    const { ingredients, instructions, prepTime, cookTime } = updatedRecipe.toObject();

    // Validate updated details
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