function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount < -1000000000000 || amount > 1000000000000) {
        return "";
    }

    let output = "";

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion'];

    function helper(num) {
        if (num === 0) return '';
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 === 0 ? '' : ' ' + ones[num % 10]);
        if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 === 0 ? '' : ' ' + helper(num % 100));
        if (num < 1000000) return helper(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 === 0 ? '' : ' ' + helper(num % 1000));
        if (num < 1000000000) return helper(Math.floor(num / 1000000)) + ' Million' + (num % 1000000 === 0 ? '' : ' ' + helper(num % 1000000));
        if (num < 1000000000000) return helper(Math.floor(num / 1000000000)) + ' Billion' + (num % 1000000000 === 0 ? '' : ' ' + helper(num % 1000000000));
        return helper(Math.floor(num / 1000000000000)) + ' Trillion' + (num % 1000000000000 === 0 ? '' : ' ' + helper(num % 1000000000000));
    }

    let absAmount = Math.abs(amount);
    let integerPart = Math.floor(absAmount);
    let fractionalPart = Math.round((absAmount - integerPart) * 100);

    if (integerPart === 0 && fractionalPart === 0) {
        output = 'Zero Dollars';
    } else {
        if (amount < 0) {
            output += 'Negative ';
        }
        if (integerPart > 0) {
            output += helper(integerPart) + ' ' + (integerPart === 1 ? 'Dollar' : 'Dollars');
        }
        if (fractionalPart > 0) {
            if (integerPart > 0) {
                output += ' and ';
            }
            output += helper(fractionalPart) + ' ' + (fractionalPart === 1 ? 'Cent' : 'Cents');
        }
    }

    return output;
}

module.exports = {
    currencyAmountInWords
};