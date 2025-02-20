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
    if (!ingredients || ingredients.length === 0) {
      return null;
    }

    // Filter ingredients based on dietary preferences
    let validIngredients = ingredients.filter(ingredient => {
      return preferences.dietaryPreference === 'any' ||
             ingredient.dietaryTags.includes(preferences.dietaryPreference);
    });

    if (validIngredients.length === 0) {
      return null;
    }

    // Sort ingredients by expiration date (ascending)
    validIngredients.sort((a, b) => a.expirationDays - b.expirationDays);

    let selectedIngredients = [];
    let totalCalories = 0;
    let targetCalories = preferences.calorie_goal;

    // Select ingredients while keeping under calorie goal
    for (let ingredient of validIngredients) {
      if (totalCalories + ingredient.calories <= targetCalories) {
        selectedIngredients.push(ingredient);
        totalCalories += ingredient.calories;
      }
    }

    // Check if we have any valid combination
    if (selectedIngredients.length === 0) {
      return null;
    }

    // If we're too far from the target calories (less than 50% of goal),
    // consider it a failed attempt
    if (totalCalories < targetCalories * 0.5) {
      return null;
    }

    // Return only the names of the ingredients
    return selectedIngredients.map(ingredient => ingredient.name);
  }
}

module.exports = { RecipeGenerator, Ingredient };