function currencyAmountInWords(amount) {
    if (!amount || typeof amount !== "number" || isNaN(amount)) {
        return ""
    }

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million'];

    let output = "";
    let isNegative = false;

    if (amount < 0) {
        isNegative = true;
        amount = Math.abs(amount);
    }

    let i = 0;
    while (amount > 0) {
        if (amount % 1000 !== 0) {
            output = helper(amount % 1000, ones, teens, tens) + " " + thousands[i] + " " + output;
        }
        amount = Math.floor(amount / 1000);
        i++;
    }

    output = output.trim();

    if (isNegative) {
        output = "Negative " + output;
    }

    return output;
}

function helper(num, ones, teens, tens) {
    let output = "";

    if (num >= 100) {
        output += ones[Math.floor(num / 100)] + " Hundred ";
        num %= 100;
    }

    if (num >= 20) {
        output += tens[Math.floor(num / 10)] + " ";
        num %= 10;
    }

    if (num >= 10) {
        output += teens[num - 10] + " ";
        num = 0;
    }

    if (num > 0) {
        output += ones[num] + " ";
    }

    return output.trim();
}

module.exports = {
    currencyAmountInWords
};