const { List, Map } = require("immutable");

class RecipeManagementSystem {
  constructor() {
    this.recipes = List();
  }

  validateTime(prepTime, cookTime) {
    if (!Number.isInteger(prepTime) || prepTime < 0 || !Number.isInteger(cookTime) || cookTime < 0) {
      throw new Error("Time must be a non-negative number");
    }
  }

  validateIngredients(ingredients) {
    if (!Array.isArray(ingredients) || !ingredients.every(ing => 
      typeof ing === 'object' && ing !== null &&
      typeof ing.name === "string" && ing.name.trim() !== "" &&
      (typeof ing.amount === "string" || typeof ing.amount === "number"))) {
      throw new Error("Invalid ingredients");
    }
  }

  validateInstructions(instructions) {
    if (typeof instructions !== "string" || instructions.trim() === "") {
      throw new Error("Instructions cannot be empty");
    }
  }

  validateRecipeId(recipeId) {
    if (typeof recipeId !== "string" || recipeId.trim() === "") {
      throw new Error("Invalid recipe details");
    }
  }

  addRecipe(recipeId, name, ingredients, instructions, prepTime, cookTime) {
    this.validateRecipeId(recipeId);
    this.validateTime(prepTime, cookTime);
    this.validateIngredients(ingredients);
    this.validateInstructions(instructions);

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
    if (!recipeId || !updatedDetails || typeof updatedDetails !== 'object') {
      throw new Error("Invalid recipe details");
    }

    const recipeIndex = this.recipes.findIndex(
      recipe => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    const currentRecipe = this.recipes.get(recipeIndex);
    const currentDetails = currentRecipe.toJS();
    
    if (JSON.stringify(currentDetails) === JSON.stringify({ ...currentDetails, ...updatedDetails })) {
      throw new Error("Same recipe object");
    }

    if (updatedDetails.prepTime !== undefined || updatedDetails.cookTime !== undefined) {
      this.validateTime(
        updatedDetails.prepTime ?? currentDetails.prepTime,
        updatedDetails.cookTime ?? currentDetails.cookTime
      );
    }

    if (updatedDetails.ingredients !== undefined) {
      this.validateIngredients(updatedDetails.ingredients);
    }

    if (updatedDetails.instructions !== undefined) {
      this.validateInstructions(updatedDetails.instructions);
    }

    const updatedRecipe = currentRecipe.merge(Map(updatedDetails));
    this.recipes = this.recipes.set(recipeIndex, updatedRecipe);
  }

  getRecipeById(recipeId) {
    this.validateRecipeId(recipeId);

    const recipe = this.recipes.find(
      recipe => recipe.get("recipeId") === recipeId
    );

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipe.toJS();
  }

  generateRecipeReport() {
    return this.recipes
      .sort((a, b) => a.get("prepTime") - b.get("prepTime"))
      .map(recipe => ({
        recipeId: recipe.get("recipeId"),
        name: recipe.get("name"),
        prepTime: recipe.get("prepTime"),
      }))
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