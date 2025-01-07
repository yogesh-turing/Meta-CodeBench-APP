function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= -1000000000000001 || amount >= 1000000000000001) {
        return "";
    }

    // Handle zero and negative zero
    if (amount === 0 || amount === -0) {
        return "Zero Dollars";
    }

    const isNegative = amount < 0;
    amount = Math.abs(amount);

    // Split amount into dollars and cents
    const dollars = Math.floor(amount);
    const cents = Math.round((amount - dollars) * 100);

    // Arrays for number conversion
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

    function convertGroup(n) {
        if (n === 0) return "";
        
        let result = "";
        
        // Handle hundreds
        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + " Hundred ";
            n %= 100;
        }
        
        // Handle tens and ones
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
        if (num === 0) return "";
        
        let result = "";
        let groupIndex = 0;
        
        while (num > 0) {
            const group = num % 1000;
            if (group !== 0) {
                result = convertGroup(group) + scales[groupIndex] + " " + result;
            }
            num = Math.floor(num / 1000);
            groupIndex++;
        }
        
        return result.trim();
    }

    let result = "";
    
    // Handle negative numbers
    if (isNegative) {
        result += "Negative ";
    }

    // Handle amounts less than 1 dollar
    if (dollars === 0 && cents > 0) {
        const centsInWords = convertToWords(cents);
        return result + centsInWords + (cents === 1 ? " Cent" : " Cents");
    }

    // Convert dollars
    result += convertToWords(dollars);
    result += (dollars === 1 ? " Dollar" : " Dollars");

    // Add cents if present
    if (cents > 0) {
        result += " and " + convertToWords(cents);
        result += (cents === 1 ? " Cent" : " Cents");
    }

    return result;
}

module.exports = {
    currencyAmountInWords
};