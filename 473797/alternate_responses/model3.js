class IngredientInventory {
    constructor(restaurantName, maxCapacity) {
        if (!restaurantName || typeof restaurantName !== 'string' || maxCapacity <= 0) {
            throw new Error("Error Encountered");
        }
        this.restaurantName = restaurantName;
        this.maxCapacity = maxCapacity;
        this.inventory = new Map();
    }

    addIngredient(ingredient, quantity, expirationDate) {
        if (!ingredient || typeof ingredient !== 'string' || 
            !Number.isInteger(quantity) || quantity <= 0 ||
            !expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
            return false;
        }

        const date = new Date(expirationDate);
        if (isNaN(date.getTime())) {
            return false;
        }

        if (this.inventory.size >= this.maxCapacity && !this.inventory.has(ingredient)) {
            return false;
        }

        if (this.inventory.has(ingredient)) {
            const currentItem = this.inventory.get(ingredient);
            currentItem.quantity += quantity;
            return true;
        } else {
            this.inventory.set(ingredient, {
                quantity: quantity,
                expirationDate: expirationDate
            });
            return true;
        }
    }

    checkIngredientStock(ingredient) {
        if (!ingredient || typeof ingredient !== 'string') {
            return 0;
        }
        return this.inventory.has(ingredient) ? this.inventory.get(ingredient).quantity : 0;
    }

    removeExpiredIngredients() {
        const currentDate = new Date();
        const expiredIngredients = [];

        for (const [ingredient, details] of this.inventory) {
            const expirationDate = new Date(details.expirationDate);
            if (expirationDate < currentDate) {
                this.inventory.delete(ingredient);
                expiredIngredients.push(ingredient);
            }
        }

        return expiredIngredients;
    }

    checkStockLevel() {
        const stockList = [];
        
        for (const [ingredient, details] of this.inventory) {
            stockList.push({
                ingredient: ingredient,
                quantity: details.quantity,
                expirationDate: details.expirationDate
            });
        }

        return stockList;
    }

    removeIngredient(ingredient) {
        if (!ingredient || typeof ingredient !== 'string') {
            return false;
        }
        return this.inventory.delete(ingredient);
    }
}

module.exports = { IngredientInventory };