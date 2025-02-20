class IngredientInventory {
    constructor(restaurantName, maxCapacity) {
        if (!restaurantName || typeof restaurantName !== 'string' || maxCapacity <= 0) {
            throw new Error("Error Encountered");
        }
        this.restaurantName = restaurantName;
        this.maxCapacity = maxCapacity;
        this.ingredients = [];
    }

    addIngredient(ingredient, quantity, expirationDate) {
        if (!ingredient || typeof ingredient !== 'string' || 
            quantity <= 0 || !Number.isInteger(quantity) ||
            !expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
            return false;
        }

        if (this.ingredients.length >= this.maxCapacity) {
            return false;
        }

        const existingIndex = this.ingredients.findIndex(item => item.ingredient === ingredient);
        
        if (existingIndex !== -1) {
            this.ingredients[existingIndex].quantity += quantity;
            this.ingredients[existingIndex].expirationDate = expirationDate;
        } else {
            this.ingredients.push({ ingredient, quantity, expirationDate });
        }
        return true;
    }

    checkIngredientStock(ingredient) {
        if (!ingredient || typeof ingredient !== 'string') {
            return 0;
        }
        
        const item = this.ingredients.find(item => item.ingredient === ingredient);
        return item ? item.quantity : 0;
    }

    removeExpiredIngredients() {
        const currentDate = new Date();
        const expiredIngredients = [];
        
        this.ingredients = this.ingredients.filter(item => {
            const expirationDate = new Date(item.expirationDate);
            if (expirationDate < currentDate) {
                expiredIngredients.push(item.ingredient);
                return false;
            }
            return true;
        });

        return expiredIngredients;
    }

    checkStockLevel() {
        return this.ingredients.map(({ ingredient, quantity, expirationDate }) => ({
            ingredient,
            quantity,
            expirationDate
        }));
    }

    removeIngredient(ingredient) {
        if (!ingredient || typeof ingredient !== 'string') {
            return false;
        }

        const initialLength = this.ingredients.length;
        this.ingredients = this.ingredients.filter(item => item.ingredient !== ingredient);
        
        return initialLength > this.ingredients.length;
    }
}

module.exports = { IngredientInventory };