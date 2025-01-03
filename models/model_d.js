function currencyAmountInWords(amount) {
    if (typeof amount !== "number" || isNaN(amount) || amount < -1000000000000 || amount > 1000000000000) {
        return "";
    }

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion'];

    function convertGroup(n) {
        let result = '';
        
        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        
        if (n >= 10 && n <= 19) {
            result += teens[n - 10];
        } else {
            result += tens[Math.floor(n / 10)];
            if (tens[Math.floor(n / 10)] && ones[n % 10]) {
                result += ' ';
            }
            result += ones[n % 10];
        }
        
        return result.trim();
    }

    function convertToWords(num) {
        if (num === 0) return 'Zero';
        
        let result = '';
        let groupIndex = 0;
        
        while (num > 0) {
            const group = num % 1000;
            if (group !== 0) {
                const groupStr = convertGroup(group);
                if (groupStr) {
                    result = groupStr + (scales[groupIndex] ? ' ' + scales[groupIndex] + ' ' : ' ') + result;
                }
            }
            num = Math.floor(num / 1000);
            groupIndex++;
        }
        
        return result.trim();
    }

    if (amount === 0 || amount === -0) {
        return "Zero Dollars";
    }

    const isNegative = amount < 0;
    amount = Math.abs(amount);

    const dollars = Math.floor(amount);
    const cents = Math.round((amount - dollars) * 100);

    let result = '';

    if (amount < 1) {
        const centsInWords = convertToWords(cents);
        return `${isNegative ? 'Negative ' : ''}${centsInWords} ${cents === 1 ? 'Cent' : 'Cents'}`;
    }

    const dollarsInWords = convertToWords(dollars);
    result = `${isNegative ? 'Negative ' : ''}${dollarsInWords} ${dollars === 1 ? 'Dollar' : 'Dollars'}`;

    if (cents > 0) {
        const centsInWords = convertToWords(cents);
        result += ` and ${centsInWords} ${cents === 1 ? 'Cent' : 'Cents'}`;
    }

    return result;
}

module.exports = {
    currencyAmountInWords
};