Base Code:
```javascript

function currencyAmountInWords(amount) {
        if (typeof amount !== "number" || isNaN(amount) || amount < -1000000000000001 || amount > 1000000000000001) {
        return "";
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
The function `currencyAmountInWords` should accept the amount as input and return its string representation as per USD.
The function should validate the amount to the number. The function should accept any number positive or negative.
e.g. if the amount is -1234, the function should return "Negative One Thousand Two Hundred Thirty Four Dollars" and 
if the amount is 2345, the function should return "Two Thousand Three Hundred Forty Five Dollars"
The function should handle amount = 0 and -0, it should return "Zero Dollars".
The function should be able to handle the maximum amount value of 1 quadrillion.
The function should handle decimal numbers and convert the fractional part to words as well. For example, 1234.56 should be converted to "One Thousand Two Hundred Thirty Four Dollars and Fifty Six Cents".
The output should include the word "and" between the integer and fractional parts. Also make sure to return "Cents" for a value other than 1, for 1 return "Cent". It should be the same for "Dollar" and "Dollars".
For an amount less than 1 and greater than 0, it should return the amount in cents only. e.g. if the amount is 0.23 it should return "Twenty Three Cents"