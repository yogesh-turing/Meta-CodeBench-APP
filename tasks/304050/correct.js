function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount < -1000000000000 || amount > 1000000000000) {
        return "";
    }

    if (amount === 0 || amount === -0) {
        return "Zero";
    }

    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Million", "Billion", "Trillion"];

    function convertToWords(num) {
        if (num === 0) return "";
        let word = "";

        for (let i = 0; num > 0; i++) {
            if (num % 1000 !== 0) {
                word = convertHundreds(num % 1000) + thousands[i] + " " + word;
            }
            num = Math.floor(num / 1000);
        }

        return word.trim();
    }

    function convertHundreds(num) {
        let word = "";
        if (num > 99) {
            word += units[Math.floor(num / 100)] + " Hundred ";
            num %= 100;
        }
        if (num > 19) {
            word += tens[Math.floor(num / 10)] + " ";
            num %= 10;
        }
        if (num > 9) {
            word += teens[num - 10] + " ";
        } else if (num > 0) {
            word += units[num] + " ";
        }
        return word;
    }

    function convertFractionalPart(num) {
        if (num === 0) return "";
        const cents = convertHundreds(Math.round(num * 100));
        return cents + (Math.round(num * 100) === 1 ? "Cent" : "Cents");
    }

    let integerPart = Math.floor(Math.abs(amount));
    let fractionalPart = Math.abs(amount) - integerPart;

    let output = convertToWords(integerPart);
    if (fractionalPart > 0) {
        output += (output.length > 1 ? " and " : "") + convertFractionalPart(fractionalPart);
    }

    if (amount < 0) {
        output = "Negative " + output;
    }

    return output;
}

module.exports = {
    currencyAmountInWords
};

console.log(currencyAmountInWords(1000000.01)); // Zero