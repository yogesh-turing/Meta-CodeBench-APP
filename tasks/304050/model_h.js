function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount < -1000000000000 || amount > 1000000000000) {
        return "";
    }

    let output = "";
    let isNegative = false;

    if (amount < 0) {
        isNegative = true;
        amount = Math.abs(amount);
    }

    let dollars = Math.floor(amount);
    let cents = Math.floor((amount - dollars) * 100);

    if (dollars === 0 && cents === 0) {
        return "Zero Dollars";
    }

    if (isNegative) {
        output += "Negative ";
    }

    if (dollars > 0) {
        output += convertToWords(dollars) + (dollars === 1 ? " Dollar" : " Dollars");
    }

    if (cents > 0) {
        if (dollars > 0) {
            output += " and ";
        }
        output += convertToWords(cents) + (cents === 1 ? " Cent" : " Cents");
    }

    return output;
}

function convertToWords(num) {
    let words = "";
    let ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    let teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    let tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    let thousands = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion"];

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

function helper(num, ones, teens, tens) {
    let words = "";
    if (num >= 100) {
        words += ones[Math.floor(num / 100)] + " Hundred";
        num %= 100;
        if (num > 0) {
            words += " ";
        }
    }

    if (num >= 20) {
        words += tens[Math.floor(num / 10)];
        num %= 10;
        if (num > 0) {
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

console.log(currencyAmountInWords(12.34));