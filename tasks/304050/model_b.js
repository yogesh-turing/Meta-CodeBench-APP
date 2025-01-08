function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= -1000000000000001 || amount >= 1000000000000001) {
        return "";
    }

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

    function convertGroup(n) {
        let result = "";
        
        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + " Hundred ";
            n %= 100;
        }
        
        if (n >= 20) {
            result += tens[Math.floor(n / 10)] + " ";
            n %= 10;
            if (n > 0) {
                result += ones[n] + " ";
            }
        } else if (n > 0) {
            result += ones[n] + " ";
        }
        
        return result;
    }

    function convertToWords(num) {
        if (num === 0) return "Zero";
        
        let result = "";
        let scaleIndex = 0;
        
        while (num > 0) {
            const group = num % 1000;
            if (group !== 0) {
                result = convertGroup(group) + scales[scaleIndex] + " " + result;
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
        }
        
        return result.trim();
    }

    if (amount === 0 || amount === -0) return "Zero Dollars";

    const isNegative = amount < 0;
    amount = Math.abs(amount);

    const dollars = Math.floor(amount);
    const cents = Math.round((amount - dollars) * 100);

    let result = "";

    // Handle amounts less than 1
    if (dollars === 0 && cents > 0) {
        result = convertToWords(cents);
        return `${isNegative ? "Negative " : ""}${result} ${cents === 1 ? "Cent" : "Cents"}`;
    }

    // Handle whole numbers and numbers with cents
    result = convertToWords(dollars);
    result = `${isNegative ? "Negative " : ""}${result} ${dollars === 1 ? "Dollar" : "Dollars"}`;

    if (cents > 0) {
        result += ` and ${convertToWords(cents)} ${cents === 1 ? "Cent" : "Cents"}`;
    }

    return result;
}

module.exports = {
    currencyAmountInWords
};