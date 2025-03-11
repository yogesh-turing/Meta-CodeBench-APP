const { List, Map } = require("immutable");

class RecipeManagementSystem {
  constructor() {
    this.recipes = List();
  }

  addRecipe(recipeId, name, ingredients, instructions, prepTime, cookTime) {
    // Validate input parameters
    if (typeof recipeId !== "string" || recipeId.trim() === "") {
      throw new Error("Invalid recipe details");
    }

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("Invalid recipe details");
    }

    if (!Array.isArray(ingredients) ||
      !ingredients.every(
        (ing) =>
          typeof ing.name === "string" &&
          (typeof ing.amount === "string" || typeof ing.amount === "number")
      )) {
      throw new Error("Invalid ingredients");
    }

    if (typeof instructions !== "string" || instructions.trim() === "") {
      throw new Error("Instructions cannot be empty");
    }

    if (!Number.isInteger(prepTime) || prepTime < 0 ||
        !Number.isInteger(cookTime) || cookTime < 0) {
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
    if (typeof recipeId !== "string" || recipeId.trim() === "" || typeof updatedDetails !== "object") {
      throw new Error("Invalid recipe details");
    }

    const recipeIndex = this.recipes.findIndex(
      (recipe) => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    const currentRecipe = this.recipes.get(recipeIndex);

    // Check if updatedDetails is the same as currentRecipe
    if (Map(updatedDetails).equals(currentRecipe)) {
      throw new Error("Same recipe object");
    }

    // Validate updated details
    if (updatedDetails.ingredients !== undefined &&
      (!Array.isArray(updatedDetails.ingredients) ||
        !updatedDetails.ingredients.every(
          (ing) =>
            typeof ing.name === "string" &&
            (typeof ing.amount === "string" || typeof ing.amount === "number")
        ))) {
      throw new Error("Invalid ingredients");
    }

    if (updatedDetails.instructions !== undefined &&
      (typeof updatedDetails.instructions !== "string" || updatedDetails.instructions.trim() === "")) {
      throw new Error("Instructions cannot be empty");
    }

    if (updatedDetails.prepTime !== undefined &&
      (!Number.isInteger(updatedDetails.prepTime) || updatedDetails.prepTime < 0)) {
      throw new Error("Time must be a non-negative number");
    }

    if (updatedDetails.cookTime !== undefined &&
      (!Number.isInteger(updatedDetails.cookTime) || updatedDetails.cookTime < 0)) {
      throw new Error("Time must be a non-negative number");
    }

    // Update the recipe
    const updatedRecipe = currentRecipe.merge(updatedDetails);
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