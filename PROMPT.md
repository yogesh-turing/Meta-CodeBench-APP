Base Code:
```javascript
function processLogs(logs, errorKeywords) {
  return logs.map(log => {
    const words = log.split(" ");
    return words.map(word => 
      errorKeywords.includes(word.toLowerCase()) ? "[REDACTED]" : word
    ).join(" ");
  });
}

module.exports = {processLogs}
```

Stack Trace:
```javascript
processLogs - Advanced Redaction Tests
    ✕ redacts error keywords with complex punctuation (2 ms)
    ✕ redacts multi-word phrases even when words are separated by extra spaces
    ✕ handles multi-line logs and redacts correctly
    ✕ handles multiple overlapping error keywords correctly (1 ms)
    ✕ handles nested phrases where one error keyword is inside another
    ✕ does not accidentally redact partial words (1 ms)
    ✕ redacts error keywords when they appear multiple times in the same log
    ✕ handles logs where error keywords appear as part of URLs or paths
    ✓ handles redaction of case-sensitive mixed logs

  ● processLogs - Advanced Redaction Tests › redacts error keywords with complex punctuation

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 3

      Array [
    -   "[REDACTED]: Unable to connect.",
    -   "[REDACTED]! Disk full...",
    -   "[REDACTED]? System failure!",
    +   "Error: Unable to connect.",
    +   "Warning! Disk full...",
    +   "Fatal? System failure!",
      ]

      14 |       "[REDACTED]? System failure!"
      15 |     ];
    > 16 |     expect(processLogs(logs, errorKeywords)).toEqual(expected);
         |                                              ^
      17 |   });
      18 |
      19 |   test("redacts multi-word phrases even when words are separated by extra spaces", () => {

      at Object.toEqual (task7/index.test.js:16:46)

  ● processLogs - Advanced Redaction Tests › redacts multi-word phrases even when words are separated by extra spaces

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
    -   "[REDACTED] detected",
    +   "Critical   system  failure detected",
      ]

      21 |     const errorKeywords = ["critical system failure"];
      22 |     const expected = ["[REDACTED] detected"];
    > 23 |     expect(processLogs(logs, errorKeywords)).toEqual(expected);
         |                                              ^
      24 |   });
      25 |
      26 |   test("handles multi-line logs and redacts correctly", () => {

      at Object.toEqual (task7/index.test.js:23:46)

  ● processLogs - Advanced Redaction Tests › handles multi-line logs and redacts correctly

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 3

      Array [
        "System started
    - [REDACTED] detected in module
    - [REDACTED]: Kernel panic",
    + Error detected in module
    + Fatal: Kernel panic",
        "User logged in
    - [REDACTED]: Low battery",
    + Warning: Low battery",
      ]

      34 |       "User logged in\n[REDACTED]: Low battery"
      35 |     ];
    > 36 |     expect(processLogs(logs, errorKeywords)).toEqual(expected);
         |                                              ^
      37 |   });
      38 |
      39 |   test("handles multiple overlapping error keywords correctly", () => {

      at Object.toEqual (task7/index.test.js:36:46)

  ● processLogs - Advanced Redaction Tests › handles multiple overlapping error keywords correctly

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Array [
    -   "[REDACTED] detected",
    -   "[REDACTED] occurred",
    +   "Critical system failure detected",
    +   "Critical failure occurred",
      ]

      41 |     const errorKeywords = ["critical system failure", "critical failure"];
      42 |     const expected = ["[REDACTED] detected", "[REDACTED] occurred"];
    > 43 |     expect(processLogs(logs, errorKeywords)).toEqual(expected);
         |                                              ^
      44 |   });
      45 |
      46 |   test("handles nested phrases where one error keyword is inside another", () => {

      at Object.toEqual (task7/index.test.js:43:46)

  ● processLogs - Advanced Redaction Tests › handles nested phrases where one error keyword is inside another

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 3

      Array [
    -   "[REDACTED] detected",
    -   "[REDACTED] occurred",
    -   "[REDACTED] detected",
    +   "Disk failure detected",
    +   "System failure occurred",
    +   "Critical system failure detected",
      ]

      48 |     const errorKeywords = ["disk failure", "system failure", "critical system failure"];
      49 |     const expected = ["[REDACTED] detected", "[REDACTED] occurred", "[REDACTED] detected"];
    > 50 |     expect(processLogs(logs, errorKeywords)).toEqual(expected);
         |                                              ^
      51 |   });
      52 |
      53 |   test("does not accidentally redact partial words", () => {

      at Object.toEqual (task7/index.test.js:50:46)

  ● processLogs - Advanced Redaction Tests › does not accidentally redact partial words

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
        "Superior errorhandling detected",
        "fatalistic approach taken",
    -   "[REDACTED]! No issue here",
    +   "Warning! No issue here",
      ]

      55 |     const errorKeywords = ["error", "fatal", "warning"];
      56 |     const expected = ["Superior errorhandling detected", "fatalistic approach taken", "[REDACTED]! No issue here"];
    > 57 |     expect(processLogs(logs, errorKeywords)).toEqual(expected);
         |                                              ^
      58 |   });
      59 |
      60 |   test("redacts error keywords when they appear multiple times in the same log", () => {

      at Object.toEqual (task7/index.test.js:57:46)

  ● processLogs - Advanced Redaction Tests › redacts error keywords when they appear multiple times in the same log

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
    -   "[REDACTED]: Something went wrong. [REDACTED] encountered again.",
    +   "Error: Something went wrong. [REDACTED] encountered again.",
      ]

      62 |     const errorKeywords = ["error"];
      63 |     const expected = ["[REDACTED]: Something went wrong. [REDACTED] encountered again."];
    > 64 |     expect(processLogs(logs, errorKeywords)).toEqual(expected);
         |                                              ^
      65 |   });
      66 |
      67 |   test("handles logs where error keywords appear as part of URLs or paths", () => {

      at Object.toEqual (task7/index.test.js:64:46)

  ● processLogs - Advanced Redaction Tests › handles logs where error keywords appear as part of URLs or paths

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Array [
    -   "Visit http://[REDACTED].com for more details",
    -   "Check /var/log/[REDACTED]-errors.log for logs",
    +   "Visit http://error.com for more details",
    +   "Check /var/log/fatal-errors.log for logs",
        "System [REDACTED] issued at C:\\Windows\\Logs",
      ]

      77 |       "System [REDACTED] issued at C:\\Windows\\Logs"
      78 |     ];
    > 79 |     expect(processLogs(logs, errorKeywords)).toEqual(expected);
         |                                              ^
      80 |   });
      81 |
      82 |   test("handles redaction of case-sensitive mixed logs", () => {

      at Object.toEqual (task7/index.test.js:79:46)

Test Suites: 1 failed, 1 total
Tests:       8 failed, 1 passed, 9 total
Snapshots:   0 total
Time:        0.127 s, estimated 1 s
```

Prompt:
The `processLogs` function is responsible for scanning system logs and redacting specific error-related keywords. However, it does not handle words with punctuation (e.g., `"error:"`) and fails to account for variations like `"Error"`, `"ERROR"`, or `"error!"`. Additionally, if an error phrase consists of multiple words (e.g., `"disk failure"`), the function only checks individual words and does not match full phrases.

### Example Usage:  

#### Input Logs:  
```
Server started successfully  
Error: Connection timeout  
WARNING! Disk space running low  
Fatal crash detected in module  
```  

#### Expected Output:  
```
Server started successfully  
[REDACTED]: Connection timeout  
[REDACTED]! Disk space running low  
[REDACTED] [REDACTED] detected in module  
```