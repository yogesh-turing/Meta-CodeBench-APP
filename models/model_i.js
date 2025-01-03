function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount < -1000000000000 || amount > 1000000000000) {
        return "";
    }

    let output = "";

    if (amount < 0) {
        output += "Negative ";
        amount = -amount;
    }

    if (amount === 0) {
        output += "Zero Dollars";
    } else {
        let integerPart = Math.floor(amount);
        let fractionalPart = Math.floor((amount - integerPart) * 100);

        output += convertToWords(integerPart) + (integerPart === 1 ? " Dollar" : " Dollars");

        if (fractionalPart > 0) {
            output += " and " + convertToWords(fractionalPart) + (fractionalPart === 1 ? " Cent" : " Cents");
        }
    }

    return output;
}

function convertToWords(num) {
    let ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    let teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    let tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    let thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion'];

    let output = '';
    let i = 0;

    if (num === 0) {
        return 'Zero';
    }

    while (num > 0) {
        if (num % 1000 !== 0) {
            output = helper(num % 1000, ones, teens, tens) + ' ' + thousands[i] + ' ' + output;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    return output.trim();
}

function helper(num, ones, teens, tens) {
    let output = '';

    if (num >= 100) {
        output += ones[Math.floor(num / 100)] + ' Hundred';
        num %= 100;
    }

    if (num >= 20) {
        output += ' ' + tens[Math.floor(num / 10)];
        num %= 10;
    }

    if (num >= 10) {
        output += ' ' + teens[num - 10];
        num = 0;
    }

    if (num > 0) {
        output += ' ' + ones[num];
    }

    return output.trim();
}

module.exports = {
    currencyAmountInWords
};