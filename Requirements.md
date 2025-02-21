Base Code:
```javascript
class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // insert code here
    }
}

module.exports = {DocumentEncryptor};
```

Prompt:
In high-security organizations handling numerous confidential documents, it's essential to encrypt specific numbers within these documents. The `encryptNumbers` method in the `DocumentEncryptor` class should be implemented to identify integer numbers and encrypt them based on the following actions, each denoted by a specific character:

| Action        | Denoted By | Remarks                                                                 |
|---------------|------------|-------------------------------------------------------------------------|
| Right Arrow   | R          | Move to the next character                                              |
| Left Arrow    | L          | Move to the previous character                                          |
| Up Arrow      | T          | Increment the digit by one (if the digit is 9, it remains 9)            |
| Down Arrow    | D          | Decrement the digit by one (if the digit is 0, it remains 0)            |
| Swap          | Sn         | Swap the current position with the number in the nth position           |

These actions are governed by the following rules:

- **Initial Position**: The starting position is at the first character of the string comprising the numbers.
- **Incrementing a Digit**: If the digit is 9, it remains 9; otherwise, it increases by 1.
- **Decrementing a Digit**: If the digit is 0, it remains 0; otherwise, it decreases by 1.
- **Negative Numbers**: If the input number string contains negative numbers, they should be considered as 0 before performing any operations.
- **Non-Numeric Input**: If the string does not contain numeric data, an `IllegalArgumentException` should be thrown.
- **Empty Actions String**: If the actions string is empty, the input string should be returned as it is.
- **Unprocessed Input**: Once all actions from the action string are consumed, if any part of the input string remains unprocessed, those characters should be left unchanged.

**Constraints**: 0 < n <= l, where n is the number of actions and l is the length of the input number string.

**Input**:
- First line: A string comprising numbers.
- Second line: A string of actions denoted by the values mentioned in the table above.

**Output**:
- A single string comprising the transformed numbers.

**Example**:
*Input*:
123456
RLTDRRTRS2S1

*Output*:
244156