// correctedBillingSystem.js

function calculateTotalBill(cart, membershipStatus, paymentMethod, discountCode = null) {
    if (!Array.isArray(cart) || cart.length == 0) {
        throw new Error("Cart must be a non-empty array.");
    }

    let total = 0;

    // Calculate the total cost of the cart items
    cart.forEach(item => {
        if (!item.price || item.price < 0 || !item.quantity || item.quantity <= 0) {
            throw new Error("Each item must have a valid price and quantity.");
        }
        total += item.price * item.quantity;
    });

    // Apply discount if available
    let discount = 0;
    if (discountCode) {
        discount = getDiscountPercentage(discountCode);
        total -= (total * discount);
    }

    // Apply membership discount
    if (membershipStatus === 'premium') {
        total -= total * 0.1;  
    }

    // Calculate tax
    const tax = total * 0.10; // 10% tax

    // Add tax to the total
    total += tax;

    // Calculate payment processing fee
    let processingFee = 0;
    if (paymentMethod === 'credit_card') {
        processingFee = total * 0.02; 
    } else if (paymentMethod === 'paypal') {
        processingFee = total * 0.03; 
    } else if (paymentMethod === 'bank_transfer') {
        processingFee = total * 0.01; 
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
        'SUMMER2025': 0.15, 
        'WINTER2025': 0.1,  
    };

    return discountDatabase[discountCode] || 0;
}

module.exports = { calculateTotalBill };