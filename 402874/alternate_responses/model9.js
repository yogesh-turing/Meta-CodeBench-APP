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
    const { calorieGoal, dietaryPreference } = preferences;

    // Filter ingredients based on dietary preference
    const filteredIngredients = ingredients.filter(ingredient => ingredient.dietaryTags.includes(dietaryPreference));

    // Sort ingredients by expiration date
    filteredIngredients.sort((a, b) => a.expirationDays - b.expirationDays);

    // Initialize variables to track the recipe and calorie count
    let recipe = [];
    let totalCalories = 0;

    // Iterate through filtered ingredients
    for (let ingredient of filteredIngredients) {
      // Check if adding the current ingredient would exceed the calorie goal
      if (totalCalories + ingredient.calories > calorieGoal) {
        continue;
      }

      // Add the ingredient to the recipe and update the calorie count
      recipe.push(ingredient.name);
      totalCalories += ingredient.calories;
    }

    // Return the recipe if it meets the calorie goal; otherwise, return null
    return totalCalories >= calorieGoal ? recipe : null;
  }
}

module.exports = { RecipeGenerator, Ingredient };