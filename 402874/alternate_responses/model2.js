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
    let filteredIngredients = ingredients;
    if (preferences.dietaryPreference) {
      filteredIngredients = ingredients.filter(ingredient => 
        ingredient.dietaryTags.includes(preferences.dietaryPreference)
      );
    }

    if (filteredIngredients.length === 0) {
      return null;
    }

    // Sort ingredients by expiration date
    filteredIngredients.sort((a, b) => a.expirationDays - b.expirationDays);

    // Select ingredients while respecting calorie goal
    let selectedIngredients = [];
    let currentCalories = 0;
    const targetCalories = preferences.calorie_goal;

    for (const ingredient of filteredIngredients) {
      if (currentCalories + ingredient.calories <= targetCalories) {
        selectedIngredients.push(ingredient);
        currentCalories += ingredient.calories;
      }
    }

    // Check if we found any valid combination
    if (selectedIngredients.length === 0) {
      return null;
    }

    // Return only the names of the ingredients
    return selectedIngredients.map(ingredient => ingredient.name);
  }
}

module.exports = { RecipeGenerator, Ingredient };