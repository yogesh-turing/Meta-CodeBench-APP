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
    const filteredIngredients = ingredients.filter(ingredient => ingredient.dietaryTags.includes(dietaryPreference));
    const sortedIngredients = filteredIngredients.sort((a, b) => a.expirationDays - b.expirationDays);
    const selectedIngredients = [];
    let totalCalories = 0;

    for (const ingredient of sortedIngredients) {
      if (totalCalories + ingredient.calories <= calorieGoal) {
        selectedIngredients.push(ingredient.name);
        totalCalories += ingredient.calories;
      }
      if (totalCalories >= calorieGoal) {
        break;
      }
    }

    if (totalCalories === 0) {
      return null;
    }

    return selectedIngredients;
  }
}

module.exports = { RecipeGenerator, Ingredient };