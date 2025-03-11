const { List, Map } = require("immutable");

class RecipeManagementSystem {
  constructor() {
    this.recipes = List();
  }

  addRecipe(recipeId, name, ingredients, instructions, prepTime, cookTime) {
    if (
      typeof recipeId !== "string" ||
      recipeId.trim() === "" ||
      typeof name !== "string" ||
      name.trim() === "" ||
      !Array.isArray(ingredients) ||
      !ingredients.every(
        (ing) =>
          typeof ing.name === "string" &&
          (typeof ing.amount === "string" || typeof ing.amount === "number")
      ) ||
      typeof instructions !== "string" ||
      instructions.trim() === "" ||
      !Number.isInteger(prepTime) ||
      prepTime < 0 ||
      !Number.isInteger(cookTime) ||
      cookTime < 0
    ) {
      throw new Error("Invalid input details");
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
    if (
      typeof recipeId !== "string" ||
      recipeId.trim() === "" ||
      !updatedDetails ||
      typeof updatedDetails !== "object"
    ) {
      throw new Error("Invalid recipe details");
    }

    const recipeIndex = this.recipes.findIndex(
      (recipe) => recipe.get("recipeId") === recipeId
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe not found");
    }

    const currentRecipe = this.recipes.get(recipeIndex);
    const updatedRecipe = Map(updatedDetails)
      .filterNot((value, key) => value === undefined);

    // Validate updated details
    if (updatedRecipe.has("prepTime") && (!Number.isInteger(updatedRecipe.get("prepTime")) || updatedRecipe.get("prepTime") < 0)) {
      throw new Error("Time must be a non-negative number");
    }
    if (updatedRecipe.has("cookTime") && (!Number.isInteger(updatedRecipe.get("cookTime")) || updatedRecipe.get("cookTime") < 0)) {
      throw new Error("Time must be a non-negative number");
    }
    if (updatedRecipe.has("ingredients")) {
      const ingredients = updatedRecipe.get("ingredients");
      if (!Array.isArray(ingredients) ||
        !ingredients.every(
          (ing) =>
            typeof ing.name === "string" &&
            (typeof ing.amount === "string" || typeof ing.amount === "number")
        )) {
        throw new Error("Invalid ingredients");
      }
      updatedRecipe.set("ingredients", List(ingredients));
    }
    if (updatedRecipe.has("instructions") && (
      typeof updatedRecipe.get("instructions") !== "string" ||
      updatedRecipe.get("instructions").trim() === ""
    )) {
      throw new Error("Instructions cannot be empty");
    }

    const mergedRecipe = currentRecipe.merge(updatedRecipe);
    if (currentRecipe.equals(mergedRecipe)) {
      throw new Error("Same recipe object");
    }

    this.recipes = this.recipes.set(recipeIndex, mergedRecipe);
  }

  // Function to get a recipe by its ID
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

  // Function to generate a report of all recipes
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

  // Function to delete a recipe
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