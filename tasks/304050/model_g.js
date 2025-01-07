function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount <= -1000000000000001 || amount >= 1000000000000001) {
        return "";
    }

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion'];

    function convertToWords(num) {
        if (num === 0) return 'Zero';
        let words = '';
        if (num < 0) {
            words += 'Negative ';
            num = -num;
        }
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
        if (num === 0) return '';
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 === 0 ? '' : ' ' + ones[num % 10]);
        return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 === 0 ? '' : ' ' + helper(num % 100));
    }

    let output = '';
    let decimalPart = '';
    if (amount % 1 !== 0) {
        decimalPart = Math.round((amount % 1) * 100);
        amount = Math.floor(amount);
    }

    output += convertToWords(amount) + (amount === 1 ? ' Dollar' : ' Dollars');

    if (decimalPart !== '') {
        output += ' and ' + convertToWords(decimalPart) + (decimalPart === 1 ? ' Cent' : ' Cents');
    }

    if (amount === 0 && decimalPart !== '') {
        output = convertToWords(decimalPart) + (decimalPart === 1 ? ' Cent' : ' Cents');
    }

    return output;
}

module.exports = {
    currencyAmountInWords
};