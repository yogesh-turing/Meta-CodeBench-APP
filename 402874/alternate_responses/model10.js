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
    if (filteredIngredients.length === 0) {
      return null;
    }

    // Sort ingredients by expiration date (sooner expiration comes first)
    filteredIngredients.sort((a, b) => a.expirationDays - b.expirationDays);

    // Initialize variables to track the total calories and selected ingredients
    let totalCalories = 0;
    const selectedIngredients = [];

    // Iterate through filtered ingredients to select those that fit within the calorie goal
    for (const ingredient of filteredIngredients) {
      if (totalCalories + ingredient.calories <= calorieGoal) {
        totalCalories += ingredient.calories;
        selectedIngredients.push(ingredient.name);
      }
      // If adding the current ingredient would exceed the calorie goal, skip it
      else {
        continue;
      }
    }

    // If no ingredients were selected (e.g., all exceeded calorie goal), return null
    if (selectedIngredients.length === 0) {
      return null;
    }

    // Return the list of selected ingredient names
    return selectedIngredients;
  }
}

module.exports = { RecipeGenerator, Ingredient };