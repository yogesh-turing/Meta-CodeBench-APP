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
    // Filter ingredients based on dietary preference
    let filteredIngredients = ingredients.filter(ingredient => ingredient.dietaryTags.includes(preferences.dietaryPreference));

    // Sort ingredients by expiration date
    filteredIngredients.sort((a, b) => a.expirationDays - b.expirationDays);

    // Initialize variables to keep track of the total calories and selected ingredients
    let totalCalories = 0;
    let selectedIngredients = [];

    // Iterate through the filtered ingredients
    for (let ingredient of filteredIngredients) {
      // Check if adding the current ingredient would exceed the calorie goal
      if (totalCalories + ingredient.calories > preferences.calorieGoal) {
        continue;
      }

      // Add the ingredient to the selected ingredients and update the total calories
      selectedIngredients.push(ingredient.name);
      totalCalories += ingredient.calories;

      // If the total calories are close enough to the calorie goal, break the loop
      if (totalCalories >= preferences.calorieGoal * 0.9) {
        break;
      }
    }

    // If no ingredients were selected, return null
    if (selectedIngredients.length === 0) {
      return null;
    }

    // Return the list of selected ingredient names
    return selectedIngredients;
  }
}

module.exports = { RecipeGenerator, Ingredient };