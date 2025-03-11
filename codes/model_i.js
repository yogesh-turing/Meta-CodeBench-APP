const { List, Map } = require("immutable");

class RecipeManagementSystem {
  constructor() {
    this.recipes = List();
  }

  addRecipe(recipeId, name, ingredients, instructions, prepTime, cookTime) {
    // Validate input
    if (
      typeof recipeId !== "string" ||
      typeof name !== "string" ||
      !Array.isArray(ingredients) ||
      typeof instructions !== "string" ||
      !Number.isInteger(prepTime) ||
      prepTime < 0 ||
      !Number.isInteger(cookTime) ||
      cookTime < 0
    ) {
      throw new Error("Invalid recipe details");
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

  updateRecipe(recipeId, updatedDetails) {
    if (typeof recipeId !== "string" || !updatedDetails || typeof updatedDetails !== "object") {
      throw new Error("Invalid recipe details");
    }

    const recipeIndex = this.recipes.findIndex(
      (recipe) => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    const currentRecipe = this.recipes.get(recipeIndex);

    const updatedRecipe = currentRecipe.merge(updatedDetails);

    // Check if the updated recipe is the same as the current recipe
    if (currentRecipe.equals(updatedRecipe)) {
      throw new Error("Same recipe object");
    }

    // Validate updated details
    const { ingredients, instructions, prepTime, cookTime } = updatedRecipe.toObject();

    if (
      (prepTime !== undefined && (!Number.isInteger(prepTime) || prepTime < 0)) ||
      (cookTime !== undefined && (!Number.isInteger(cookTime) || cookTime < 0))
    ) {
      throw new Error("Time must be a non-negative number");
    }

    if (
      ingredients &&
      (!List.isList(ingredients) || !ingredients.every(
        (ing) =>
          typeof ing.get("name") === "string" &&
          (typeof ing.get("amount") === "string" || typeof ing.get("amount") === "number")
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