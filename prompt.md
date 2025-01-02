Base Code:
```javascript

function currencyAmountInWords(amount) {
        if (typeof amount !== "number" || isNaN(amount) || amount < -1000000000000 || amount > 1000000000000) {
        return "";
    }

    if (amount === 0 || amount === -0) {
        return "Zero";
    }
    let output = "";

    // TODO - implement the code
    return output
   
}

module.exports = {
    currencyAmountInWords
};
```

Prompt:

Please help to complete the code, 
The function `currencyAmountInWords` should accept the amount as input.
The function should validate amount to number. The function should accept any number positive or negative.
If the amount is negative function should prepend the amount in word with string Negative.
e.g. if amount is -1234, the function should return "Negative One Thousand Two Hundred Thirty Four" and 
if amount is 2345, the function should return "Two Thousand Three Hundred Forty Five"
The function should be able to handle amount value ion trillions (from -1000000000000 to 1000000000000)
The function should handle decimal numbers and convert the fractional part to words as well. For example, 1234.56 should be converted to "One Thousand Two Hundred Thirty Four and Fifty Six Cents".
The output should include the word "and" between the integer and fractional parts. Also make sure to return "Cents" for value other than 1, for 1 return "Cent".
For amount less than 1 and greater than 0 it should return amount in cents only. e.g. if amount is 0.23 it should return "Twenty Three Cents"