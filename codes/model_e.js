const { List, Map } = require("immutable");

class RecipeManagementSystem {
  constructor() {
    this.recipes = List();
  }

  addRecipe(recipeId, name, ingredients, instructions, prepTime, cookTime) {
    if (!Number.isInteger(prepTime) || prepTime < 0 || !Number.isInteger(cookTime) || cookTime < 0) {
      throw new Error("Time must be a non-negative number");
    }

    if (!Array.isArray(ingredients) || !ingredients.every(ing => 
      typeof ing === 'object' && 
      ing !== null && 
      typeof ing.name === "string" && 
      (typeof ing.amount === "string" || typeof ing.amount === "number"))) {
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
    if (!recipeId || typeof recipeId !== 'string') {
      throw new Error("Invalid recipe details");
    }

    if (!updatedDetails || typeof updatedDetails !== 'object') {
      throw new Error("Invalid recipe details");
    }

    const recipeIndex = this.recipes.findIndex(
      recipe => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    const currentRecipe = this.recipes.get(recipeIndex);
    const currentRecipeObj = currentRecipe.toObject();

    if (JSON.stringify(currentRecipeObj) === JSON.stringify(updatedDetails)) {
      throw new Error("Same recipe object");
    }

    const { prepTime, cookTime, ingredients, instructions } = updatedDetails;

    if (prepTime !== undefined && (!Number.isInteger(prepTime) || prepTime < 0)) {
      throw new Error("Time must be a non-negative number");
    }

    if (cookTime !== undefined && (!Number.isInteger(cookTime) || cookTime < 0)) {
      throw new Error("Time must be a non-negative number");
    }

    if (ingredients !== undefined && (!Array.isArray(ingredients) || !ingredients.every(ing => 
      typeof ing === 'object' && 
      ing !== null && 
      typeof ing.name === "string" && 
      (typeof ing.amount === "string" || typeof ing.amount === "number")))) {
      throw new Error("Invalid ingredients");
    }

    if (instructions !== undefined && (typeof instructions !== "string" || instructions.trim() === "")) {
      throw new Error("Instructions cannot be empty");
    }

    const updatedRecipe = currentRecipe.merge(Map(updatedDetails));
    this.recipes = this.recipes.set(recipeIndex, updatedRecipe);
  }

  getRecipeById(recipeId) {
    if (!recipeId || typeof recipeId !== "string") {
      throw new Error("Invalid recipe details");
    }

    const recipe = this.recipes.find(
      recipe => recipe.get("recipeId") === recipeId
    );

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipe.toObject();
  }

  generateRecipeReport() {
    return this.recipes
      .map(recipe => ({
        recipeId: recipe.get("recipeId"),
        name: recipe.get("name"),
        prepTime: recipe.get("prepTime"),
      }))
      .sortBy(recipe => recipe.prepTime)
      .toArray();
  }

  deleteRecipe(recipeId) {
    const recipeIndex = this.recipes.findIndex(
      recipe => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    this.recipes = this.recipes.delete(recipeIndex);
  }
}

module.exports = { RecipeManagementSystem };