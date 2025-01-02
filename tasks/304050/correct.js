function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount < -1000000000000 || amount > 1000000000000) {
        return "";
    }

    if (amount === 0 || amount === -0) {
        return "Zero Dollars";
    }

    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Million", "Billion", "Trillion"];

    function convertToWords(num) {
        if (num === 0) return "";
        if (num < 10) return units[num];
        if (num < 20) return teens[num - 11];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "");
        if (num < 1000) return units[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + convertToWords(num % 100) : "");

        for (let i = 0, unit = 1000; i < thousands.length; i++, unit *= 1000) {
            if (num < unit * 1000) {
                return convertToWords(Math.floor(num / unit)) + " " + thousands[i] + (num % unit !== 0 ? " " + convertToWords(num % unit) : "");
            }
        }
    }

    let integerPart = Math.floor(Math.abs(amount));
    let fractionalPart = Math.round((Math.abs(amount) - integerPart) * 100);

    let integerWords = convertToWords(integerPart);
    let fractionalWords = fractionalPart > 0 ? convertToWords(fractionalPart) : "";

    let output = "";
    if (amount < 0) {
        output += "Negative ";
    }

    if (integerPart > 0) {
        output += integerWords + (integerPart === 1 ? " Dollar" : " Dollars");
    }

    if (fractionalPart > 0) {
        if (integerPart > 0) {
            output += " and ";
        }
        output += fractionalWords + (fractionalPart === 1 ? " Cent" : " Cents");
    }

    if (integerPart === 0 && fractionalPart > 0) {
        output = fractionalWords + (fractionalPart === 1 ? " Cent" : " Cents");
    }

    return output;
}

module.exports = {
    currencyAmountInWords
};