function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= -1000000000000001 || amount >= 1000000000000001) {
        return "";
    }

    let output = "";

    if (amount < 0) {
        output += "Negative ";
        amount = Math.abs(amount);
    }

    let integerPart = Math.floor(amount);
    let fractionalPart = Math.round((amount - integerPart) * 100);

    // Integer part
    if (integerPart === 0) {
        output += "Zero";
    } else {
        output += getNumberInWords(integerPart);
    }

    // Fractional part
    if (fractionalPart > 0) {
        if (integerPart > 0) {
            output += " and ";
        }
        output += getNumberInWords(fractionalPart);
        output += " " + (fractionalPart === 1 ? "Cent" : "Cents");
    }

    // Append dollar(s) to the integer part
    if (integerPart > 0) {
        output += " " + (integerPart === 1 ? "Dollar" : "Dollars");
    }

    return output;
}

function getNumberInWords(number) {
    let ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    let teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    let tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    let thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion'];

    let output = "";
    let i = 0;

    while (number > 0) {
        if (number % 1000 !== 0) {
            output = helper(number % 1000, ones, teens, tens) + " " + thousands[i] + " " + output;
        }
        number = Math.floor(number / 1000);
        i++;
    }

    return output.trim();
}

function helper(number, ones, teens, tens) {
    let output = "";

    if (number >= 100) {
        output += ones[Math.floor(number / 100)] + " Hundred";
        if (number % 100 !== 0) {
            output += " ";
        }
        number %= 100;
    }

    if (number >= 20) {
        output += tens[Math.floor(number / 10)];
        if (number % 10 !== 0) {
            output += " ";
        }
        number %= 10;
    }

    if (number >= 10) {
        output += teens[number - 10];
    } else if (number > 0) {
        output += ones[number];
    }

    return output;
}

module.exports = {
    currencyAmountInWords
};