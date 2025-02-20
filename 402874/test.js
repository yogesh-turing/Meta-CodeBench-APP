const { RecipeGenerator, Ingredient } = require('./solution');

describe('RecipeGenerator Tests', () => {
  test('testEmptyIngredients', () => {
    const ingredients = [];
    const preferences = { dietary_preference: 'vegan', calorie_goal: 200 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe).toEqual([]);
  });

  test('testNullIngredients', () => {
    const preferences = { dietary_preference: 'vegan', calorie_goal: 200 };
    const recipe = RecipeGenerator.generateRecipe(null, preferences);
    expect(recipe).toEqual([]);
  });

  test('testNullPreferences', () => {
    const ingredients = [new Ingredient('Apple', 5, 95, 'Fruit', ['vegan'])];
    const recipe = RecipeGenerator.generateRecipe(ingredients, null);
    expect(recipe).toEqual([]);
  });

  test('testInvalidCalorieGoal', () => {
    const ingredients = [new Ingredient('Apple', 5, 95, 'Fruit', ['vegan'])];
    const preferences = { dietary_preference: 'vegan', calorie_goal: -100 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe).toEqual([]);
  });

  test('testNoMatchingDietaryPreferences', () => {
    const ingredients = [new Ingredient('Chicken', 3, 250, 'Meat', ['protein'])];
    const preferences = { dietary_preference: 'vegan', calorie_goal: 200 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe).toEqual([]);
  });

  test('testDuplicateIngredients', () => {
    const ingredients = [
      new Ingredient('Apple', 5, 95, 'Fruit', ['vegan']),
      new Ingredient('Apple', 5, 95, 'Fruit', ['vegan']),
    ];
    const preferences = { dietary_preference: 'vegan', calorie_goal: 200 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe.length).toBeGreaterThan(0);
  });

  test('testCalorieGoalExactlyMet', () => {
    const ingredients = [new Ingredient('Rice', 5, 200, 'Grain', ['vegan'])];
    const preferences = { dietary_preference: 'vegan', calorie_goal: 200 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe.length).toBeGreaterThan(0);
  });

  test('testOnlyMatchingDietaryItemsAreIncluded', () => {
    const ingredients = [
      new Ingredient('Chicken', 3, 250, 'Meat', ['protein']),
      new Ingredient('Apple', 5, 95, 'Fruit', ['vegan']),
    ];
    const preferences = { dietary_preference: 'vegan', calorie_goal: 100 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe).not.toContain('Chicken');
  });

  test('testSortingByExpirationDate', () => {
    const ingredients = [
      new Ingredient('Apple', 5, 95, 'Fruit', ['vegan']),
      new Ingredient('Banana', 2, 100, 'Fruit', ['vegan']),
    ];
    const preferences = { dietary_preference: 'vegan', calorie_goal: 200 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe[0]).toBe('Banana');
  });

  // Additional test cases

  test('testNullIngredientsAndPreferences', () => {
    const recipe = RecipeGenerator.generateRecipe(null, null);
    expect(recipe).toEqual([]);
  });

  test('testEmptyIngredientsAndPreferences', () => {
    const ingredients = [];
    const preferences = { dietary_preference: 'vegan', calorie_goal: 200 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe).toEqual([]);
  });

  test('testIngredientsWithNoMatchingDietaryPreferences', () => {
    const ingredients = [
      new Ingredient('Chicken', 3, 250, 'Meat', ['protein']),
      new Ingredient('Beef', 2, 300, 'Meat', ['protein']),
    ];
    const preferences = { dietary_preference: 'vegan', calorie_goal: 500 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe).toEqual([]);
  });

  test('testIngredientsWithMatchingDietaryPreferences', () => {
    const ingredients = [
      new Ingredient('Apple', 5, 95, 'Fruit', ['vegan']),
      new Ingredient('Banana', 2, 100, 'Fruit', ['vegan']),
    ];
    const preferences = { dietary_preference: 'vegan', calorie_goal: 200 };
    const recipe = RecipeGenerator.generateRecipe(ingredients, preferences);
    expect(recipe).toEqual(['Banana', 'Apple']);
  });
});