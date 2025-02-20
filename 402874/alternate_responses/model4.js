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
      if (!preferences.dietaryPreference) {
        return true;
      }
      return ingredient.dietaryTags.includes(preferences.dietaryPreference);
    });

    if (validIngredients.length === 0) {
      return null;
    }

    // Sort ingredients by expiration date (ascending)
    validIngredients.sort((a, b) => a.expirationDays - b.expirationDays);

    let selectedIngredients = [];
    let currentCalories = 0;
    let targetCalories = preferences.calorie_goal;

    // Select ingredients while staying under calorie goal
    for (let ingredient of validIngredients) {
      if (currentCalories + ingredient.calories <= targetCalories) {
        selectedIngredients.push(ingredient);
        currentCalories += ingredient.calories;
      }
    }

    // Check if we have any valid combination
    if (selectedIngredients.length === 0) {
      return null;
    }

    // Return only the names of the ingredients
    return selectedIngredients.map(ingredient => ingredient.name);
  }
}

module.exports = { RecipeGenerator, Ingredient };