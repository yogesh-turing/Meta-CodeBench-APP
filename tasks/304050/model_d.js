function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= -1000000000000001 || amount >= 1000000000000001) {
        return "";
    }

    // Handle zero cases
    if (amount === 0 || amount === -0) {
        return "Zero Dollars";
    }

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    function convertToWords(num) {
        if (num === 0) return "";
        else if (num < 10) return ones[num];
        else if (num < 20) return teens[num - 10];
        else if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
        else if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + convertToWords(num % 100) : "");
        else if (num < 1000000) return convertToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + convertToWords(num % 1000) : "");
        else if (num < 1000000000) return convertToWords(Math.floor(num / 1000000)) + " Million" + (num % 1000000 !== 0 ? " " + convertToWords(num % 1000000) : "");
        else return convertToWords(Math.floor(num / 1000000000)) + " Billion" + (num % 1000000000 !== 0 ? " " + convertToWords(num % 1000000000) : "");
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
    
    // Build the dollar part
    if (dollars > 0) {
        result += `${isNegative ? "Negative " : ""}${convertToWords(dollars)} ${dollars === 1 ? "Dollar" : "Dollars"}`;
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