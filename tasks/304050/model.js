function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount < -1000000000000 || amount > 1000000000000) {
        return "";
    }

    let output = "";

    // Handle negative numbers
    if (amount < 0) {
        output += "Negative ";
        amount = Math.abs(amount);
    }

    // Handle decimal numbers
    let decimalPart = amount - Math.floor(amount);
    let integerPart = Math.floor(amount);

    // Convert integer part to words
    let integerWords = convertToWords(integerPart);

    // Convert decimal part to words
    let decimalWords = "";
    if (decimalPart > 0) {
        decimalWords = convertToWords(Math.round(decimalPart * 100));
        if (decimalWords !== "Zero") {
            decimalWords += " Cent" + (decimalPart === 0.01 ? "" : "s");
        }
    }

    // Combine integer and decimal parts
    if (integerWords !== "Zero") {
        output += integerWords + " Dollar" + (integerPart === 1 ? "" : "s");
        if (decimalWords !== "") {
            output += " and " + decimalWords;
        }
    } else {
        output += decimalWords;
    }

    return output;
}

// Helper function to convert numbers to words
function convertToWords(num) {
    let words = "";
    let ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    let teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    let tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    let thousands = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion"];

    if (num === 0) {
        return "Zero";
    }

    let i = 0;
    while (num > 0) {
        if (num % 1000 !== 0) {
            words = helper(num % 1000, ones, teens, tens) + " " + thousands[i] + " " + words;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    return words.trim();
}

// Helper function to convert numbers less than 1000 to words
function helper(num, ones, teens, tens) {
    let words = "";

    if (num >= 100) {
        words += ones[Math.floor(num / 100)] + " Hundred";
        num %= 100;
        if (num !== 0) {
            words += " and ";
        }
    }

    if (num >= 20) {
        words += tens[Math.floor(num / 10)];
        num %= 10;
        if (num !== 0) {
            words += " ";
        }
    }

    if (num >= 10) {
        words += teens[num - 10];
    } else if (num > 0) {
        words += ones[num];
    }

    return words;
}

module.exports = {
    currencyAmountInWords
};