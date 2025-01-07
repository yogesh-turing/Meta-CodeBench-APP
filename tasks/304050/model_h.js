function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= -1000000000000001 || amount >= 1000000000000001) {
        return "";
    }

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion'];

    let output = "";

    if (amount < 0) {
        output += "Negative ";
        amount = -amount;
    }

    let wholePart = Math.floor(amount);
    let fractionalPart = Math.round((amount - wholePart) * 100);

    if (wholePart === 0 && fractionalPart === 0) {
        return "Zero Dollars";
    }

    if (wholePart > 0) {
        output += convertNumberToWords(wholePart, ones, teens, tens, thousands) + " ";
        output += (wholePart === 1) ? "Dollar" : "Dollars";
    }

    if (fractionalPart > 0) {
        if (wholePart > 0) {
            output += " and ";
        }
        output += convertNumberToWords(fractionalPart, ones, teens, tens, thousands) + " ";
        output += (fractionalPart === 1) ? "Cent" : "Cents";
    }

    return output;
}

function convertNumberToWords(number, ones, teens, tens, thousands) {
    let output = "";

    if (number < 10) {
        output += ones[number];
    } else if (number < 20) {
        output += teens[number - 10];
    } else if (number < 100) {
        output += tens[Math.floor(number / 10)];
        if (number % 10 !== 0) {
            output += " " + ones[number % 10];
        }
    } else if (number < 1000) {
        output += ones[Math.floor(number / 100)] + " Hundred";
        if (number % 100 !== 0) {
            output += " " + convertNumberToWords(number % 100, ones, teens, tens, thousands);
        }
    } else {
        let i = 0;
        while (number >= 1000) {
            number /= 1000;
            i++;
        }
        output += convertNumberToWords(Math.floor(number), ones, teens, tens, thousands) + " " + thousands[i];
        if (number % 1 !== 0) {
            output += " " + convertNumberToWords(Math.floor((number % 1) * 1000), ones, teens, tens, thousands);
        }
    }

    return output;
}

module.exports = {
    currencyAmountInWords
};