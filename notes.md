```javascript
```

The model failed to handle amount = 1000000000000000 i.e.  "One Quadrillion"
In scales array, the entry for "quadrillion" is missing

```javascript
    const scales = ["", "Thousand", "Million", "Billion", "Trillion"];
```





The model failed to handle larger values (greater than a million) correctly.

The function convertToWords is missing else if conditions for billion, trillion, etc.
```javascript
function convertToWords(num) {
        if (num === 0) return "";
        else if (num < 10) return ones[num];
        else if (num < 20) return teens[num - 10];
        else if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
        else if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + convertToWords(num % 100) : "");
        else if (num < 1000000) return convertToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + convertToWords(num % 1000) : "");
        else if (num < 1000000000) return convertToWords(Math.floor(num / 1000000)) + " Million" + (num % 1000000 !== 0 ? " " + convertToWords(num % 1000000) : "");
        else return convertToWords(Math.floor(num / 1000000000)) + " Billion" + (num % 1000000000 !== 0 ? " " + convertToWords(num % 1000000000) : "");
    }
```



The model failed to handle amount = 1000000000000000 i.e.  "One Quadrillion"
In divisions array, the entry for "quadrillion" is missing

```javascript
    const divisions = [
            [1000000000000, "Trillion"],
            [1000000000, "Billion"],
            [1000000, "Million"],
            [1000, "Thousand"]
        ];
```


The model failed to handle negative values.
The model tried to handle negative values in the `convertToWords` function, this function is called from multiple places, hence the "Negative" word added to the output string at an unexpected place.

```javascript
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
```