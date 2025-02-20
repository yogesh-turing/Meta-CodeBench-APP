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

    const { dietary_preference, calorie_goal } = preferences;

    // Filter ingredients based on dietary preference
    let validIngredients = ingredients;
    if (dietary_preference) {
      validIngredients = ingredients.filter(ingredient => 
        ingredient.dietaryTags.includes(dietary_preference)
      );
    }

    if (validIngredients.length === 0) {
      return null;
    }

    // Sort ingredients by expiration date (ascending)
    validIngredients.sort((a, b) => a.expirationDays - b.expirationDays);

    // Generate recipe while staying within calorie goal
    const selectedIngredients = [];
    let currentCalories = 0;

    for (const ingredient of validIngredients) {
      if (currentCalories + ingredient.calories <= calorie_goal) {
        selectedIngredients.push(ingredient);
        currentCalories += ingredient.calories;
      }
    }

    // Return null if no ingredients were selected or if minimum calories weren't met
    if (selectedIngredients.length === 0) {
      return null;
    }

    // Return list of ingredient names
    return selectedIngredients.map(ingredient => ingredient.name);
  }
}

module.exports = { RecipeGenerator, Ingredient };