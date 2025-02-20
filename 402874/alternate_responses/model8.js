class Ingredient {
  constructor(name, expirationDays, calories, category, dietaryTags) {
    this.name = name;
    this.expirationDays = expirationDays;
    this.calories = calories;
    this.category = category;
    this.dietaryTags = dietaryTags;
  }
}

class RecipeGenerator {
  static generateRecipe(ingredients, preferences) {
    const { dietaryPreference, calorieGoal } = preferences;
    // Filter ingredients based on dietary preference
    const filteredIngredients = ingredients.filter((ingredient) =>
      ingredient.dietaryTags.includes(dietaryPreference)
    );

    // If no ingredients match the dietary preference, return null
    if (filteredIngredients.length === 0) return null;

    // Sort ingredients by expiration date (soonest first)
    filteredIngredients.sort((a, b) => a.expirationDays - b.expirationDays);

    // Initialize variables for the recipe generation
    let totalCalories = 0;
    const selectedIngredients = [];

    // Iterate through the filtered ingredients
    for (const ingredient of filteredIngredients) {
      // Check if adding the current ingredient exceeds the calorie goal
      if (totalCalories + ingredient.calories > calorieGoal) continue;

      // Add the ingredient to the recipe and update total calories
      selectedIngredients.push(ingredient.name);
      totalCalories += ingredient.calories;

      // If the calorie goal is reached, break the loop
      if (totalCalories >= calorieGoal) break;
    }

    // If no valid combination is found (e.g., calorie goal too high), return null
    if (totalCalories < calorieGoal) return null;

    // Return the list of selected ingredient names
    return selectedIngredients;
  }
}

module.exports = { RecipeGenerator, Ingredient };