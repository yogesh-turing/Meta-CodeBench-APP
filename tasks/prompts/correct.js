const Joi = require('joi');

const cartValidation = (cart) => {
    // Validate input using Joi
    const schema = Joi.object({
        price: Joi.number().min(0).required(),
        quantity: Joi.number().min(1).required()
    }).required();

    const { error } = schema.validate(cart);
    if (error) {
        throw new Error(`Invalid input: ${error.message}`);
    }
}

function calculateTotalBill(cart, membershipStatus, paymentMethod, discountCode = null) {
    cartValidation(cart);

    let total = 0;

    // Calculate the total cost of the cart items
    cart.forEach(item => {
        if (!item.price || item.price < 0 || !item.quantity || item.quantity < 1) {
            throw new Error("Each item must have a valid price and quantity.");
        }
        total += item.price * item.quantity;
    });

    // Apply discount if available
    let discount = 0;
    if (discountCode) {
        discount = getDiscountPercentage(discountCode);
        total = total - (total * discount);
    }

    // Apply membership discount (e.g., 10% for premium members)
    if (membershipStatus === 'premium') {
        total = total - (total * 0.1);
    }

    // Calculate tax (10% flat rate)
    const tax = total * 0.1;

    // Add tax to the total
    total += tax;

    // Calculate payment processing fee based on payment method
    let processingFee = 0;
    if (paymentMethod === 'credit_card') {
        processingFee = total * 0.02; // 2% for credit card
    } else if (paymentMethod === 'paypal') {
        processingFee = total * 0.03; // 3% for PayPal
    } else if (paymentMethod === 'bank_transfer') {
        processingFee = total * 0.01; // 1% for bank transfer
    } else {
        throw new Error("Unsupported payment method.");
    }

    total += processingFee;

    // Final total with all applied charges
    return {
        totalAmount: total.toFixed(2),
        discountApplied: discount * 100,
        taxAmount: tax.toFixed(2),
        processingFee: processingFee.toFixed(2)
    };
}

function getDiscountPercentage(discountCode) {
    const discountDatabase = {
        'SUMMER2025': 0.15, // 15% off
        'WINTER2025': 0.1,  // 10% off
    };

    return discountDatabase[discountCode] || 0;
}

module.exports = { calculateTotalBill };
