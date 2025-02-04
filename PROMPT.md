Base Code:
```javascript
function calculateFinalPrice(product, user, location) {
    if (product.price === 0) {
        return { finalPrice: 0 };
    }

    let basePrice = product.price;
    let discount = 0;
    
    if (user.type === 'premium') {
        discount = 0.1;
    } else if (user.type === 'wholesale') {
        discount = 0.2;
    } else if (user.loyaltyPoints > 100) {
        discount = 0.05;
    }

    let discountedPrice = basePrice - (basePrice * discount);

    let taxRate = 0;
    if (product.category === 'electronics') {
        taxRate = 0.15;
    } else if (product.category === 'clothing') {
        taxRate = 0.05;
    } else {
        taxRate = 0.1;
    }

    let taxAmount = discountedPrice * taxRate;
    
    let shippingCost = 10;
    if (location.country === 'US') {
        if (location.state === 'CA') {
            shippingCost = 5;
        } else if (location.state === 'NY') {
            shippingCost = 8;
        }
    } else {
        shippingCost = 15;
    }

    if (product.weight > 5) {
        shippingCost += 5;
    }

    if (user.type === 'premium') {
        shippingCost *= 0.9;
    }

    return {
        finalPrice: discountedPrice + taxAmount + shippingCost,
        breakdown: {
            basePrice,
            discountApplied: basePrice * discount,
            taxAmount,
            shippingCost
        }
    };
}


module.exports = {
    calculateFinalPrice
};

```
Prompt:

The `calculateFinalPrice` function calculates the final price of a product in an e-commerce platform.
The function applies multiple discounts, calculates taxes based on product category, determines shipping costs, and handles different price adjustments based on user type (e.g., regular, premium, or wholesale customers).

The function is messy, difficult to maintain, and lacks proper structure. 

Please help to refactor this function to improve its readability, encapsulation, and reusability using OOP principles. The function should produce the same output.
Consider the following points for refactoring:
1. Use classes & methods (e.g., PriceCalculator, TaxCalculator, ShippingCalculator) to encapsulate logic 
2. Use polymorphism for applying different tax rules, discounts, and shipping rates
3. Improve readability and maintainability

Note: Please make sure to export `calculateFinalPrice` function which take input paramenters product, user, and location. 