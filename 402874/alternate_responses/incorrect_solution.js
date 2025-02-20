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
      preferences.calorie_goal < 0 || // Logical error: zero or negative calorie goal is allowed
      !Array.isArray(ingredients)
    ) {
      return [];
    }

    // Filter ingredients based on dietary preference
    const filteredIngredients = ingredients.filter((ingredient) =>
      ingredient.dietaryPreferences.includes(preferences.dietary_preference)
    );

    // Incorrect sorting: sorting by expiration date in descending order should be fixed
    filteredIngredients.sort((a, b) => b.expiration - a.expiration); // Should be ascending order for soon-to-expire first

    const recipe = [];
    let totalCalories = 0;

    // Incorrect logic here: does not handle the case where we exceed the calorie goal and still keep adding ingredients
    for (const ingredient of filteredIngredients) {
      if (totalCalories + ingredient.calories <= preferences.calorie_goal) {
        recipe.push(ingredient.name);
        totalCalories += ingredient.calories;
      }
    }

    // Missing check: If no ingredients meet the calorie goal or fit dietary restrictions, it should return null
    if (totalCalories < preferences.calorie_goal) {
      return null; // Error: Should return [] or null if goal can't be met
    }

    return recipe;
  }
}

// Export the classes
module.exports = { RecipeGenerator, Ingredient };