class Ingredient {
  constructor(name, expiration, calories, category, dietaryPreferences) {
    this.name = name;
    this.expiration = expiration; // Represents days until expiration
    this.calories = calories;
    this.category = category;
    this.dietaryPreferences = dietaryPreferences;
  }
}

class RecipeGenerator {
  static generateRecipe(ingredients, preferences) {
    if (
      !ingredients ||
      !preferences ||
      preferences.calorie_goal <= 0 ||
      !Array.isArray(ingredients)
    ) {
      return [];
    }

    // Filter ingredients based on dietary preference
    const filteredIngredients = ingredients.filter((ingredient) =>
      ingredient.dietaryPreferences.includes(preferences.dietary_preference)
    );

    // Sort ingredients by expiration date (ascending)
    filteredIngredients.sort((a, b) => a.expiration - b.expiration);

    const recipe = [];
    let totalCalories = 0;

    // Iterate over sorted ingredients and add to recipe until calorie goal is met
    for (const ingredient of filteredIngredients) {
      // Check if adding this ingredient exceeds the calorie goal
      if (totalCalories + ingredient.calories <= preferences.calorie_goal) {
        recipe.push(ingredient.name);
        totalCalories += ingredient.calories;
      }
      // If calorie goal is met, break out of the loop
      if (totalCalories >= preferences.calorie_goal) {
        break;
      }
    }

    // Return the list of ingredient names in the recipe
    return recipe;
  }
}

// Export the classes
module.exports = { RecipeGenerator, Ingredient };