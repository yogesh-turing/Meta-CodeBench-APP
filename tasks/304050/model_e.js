function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= -1000000000000001 || amount >= 1000000000000001) {
        return "";
    }

    // Handle zero cases
    if (amount === 0 || amount === -0) {
        return "Zero Dollars";
    }

    const numberToWords = {
        0: "", 1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
        6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten",
        11: "Eleven", 12: "Twelve", 13: "Thirteen", 14: "Fourteen", 15: "Fifteen",
        16: "Sixteen", 17: "Seventeen", 18: "Eighteen", 19: "Nineteen",
        20: "Twenty", 30: "Thirty", 40: "Forty", 50: "Fifty",
        60: "Sixty", 70: "Seventy", 80: "Eighty", 90: "Ninety"
    };

    function convertToWords(num) {
        if (num === 0) return "";
        if (num < 20) return numberToWords[num];
        if (num < 100) {
            return numberToWords[Math.floor(num / 10) * 10] + (num % 10 ? " " + numberToWords[num % 10] : "");
        }
        if (num < 1000) {
            return numberToWords[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convertToWords(num % 100) : "");
        }
        const divisions = [
            [1000000000000, "Trillion"],
            [1000000000, "Billion"],
            [1000000, "Million"],
            [1000, "Thousand"]
        ];
        
        for (const [divisor, label] of divisions) {
            if (num >= divisor) {
                return convertToWords(Math.floor(num / divisor)) + " " + label + (num % divisor ? " " + convertToWords(num % divisor) : "");
            }
        }
    }

    let isNegative = amount < 0;
    amount = Math.abs(amount);
    
    let dollars = Math.floor(amount);
    let cents = Math.round((amount - dollars) * 100);

    let result = "";

    // Handle amounts less than 1
    if (dollars === 0 && cents > 0) {
        return `${isNegative ? "Negative " : ""}${convertToWords(cents)} ${cents === 1 ? "Cent" : "Cents"}`;
    }

    // Build the dollars part
    if (dollars > 0) {
        result = `${isNegative ? "Negative " : ""}${convertToWords(dollars)} ${dollars === 1 ? "Dollar" : "Dollars"}`;
    }

    // Add cents if present
    if (cents > 0) {
        result += ` and ${convertToWords(cents)} ${cents === 1 ? "Cent" : "Cents"}`;
    }

    return result.trim();
}

module.exports = {
    currencyAmountInWords
};