function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= -1000000000000001 || amount >= 1000000000000001) {
        return "";
    }

    let output = "";

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion'];

    function toWords(num) {
        let words = '';
        let i = 0;
        while (num > 0) {
            if (num % 1000 !== 0) {
                words = helper(num % 1000) + ' ' + thousands[i] + ' ' + words;
            }
            num = Math.floor(num / 1000);
            i++;
        }
        return words.trim();
    }

    function helper(num) {
        if (num === 0) {
            return '';
        } else if (num < 10) {
            return ones[num];
        } else if (num < 20) {
            return teens[num - 10];
        } else if (num < 100) {
            return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
        } else {
            return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + helper(num % 100) : '');
        }
    }

    function toCents(num) {
        let words = '';
        if (num === 1) {
            words = 'One Cent';
        } else {
            words = toWords(num) + ' Cents';
        }
        return words;
    }

    if (amount < 0) {
        output += 'Negative ';
        amount = -amount;
    }

    let dollars = Math.floor(amount);
    let cents = Math.round((amount - dollars) * 100);

    if (dollars === 0 && cents === 0) {
        output += 'Zero Dollars';
    } else if (dollars === 0) {
        output += toCents(cents);
    } else {
        output += toWords(dollars) + (dollars === 1 ? ' Dollar' : ' Dollars');
        if (cents > 0) {
            output += ' and ' + toCents(cents);
        }
    }

    return output;
}

module.exports = {
    currencyAmountInWords
};