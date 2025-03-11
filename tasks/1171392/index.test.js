const { processLogs } = require(process.env.TARGET_FILE);

describe("processLogs - Advanced Redaction Tests", () => {
  test("redacts error keywords with complex punctuation", () => {
    const logs = [
      "Error: Unable to connect.",
      "Warning! Disk full...",
      "Fatal? System failure!"
    ];
    const errorKeywords = ["error", "warning", "fatal"];
    const expected = [
      "[REDACTED]: Unable to connect.",
      "[REDACTED]! Disk full...",
      "[REDACTED]? System failure!"
    ];
    expect(processLogs(logs, errorKeywords)).toEqual(expected);
  });

  test("redacts multi-word phrases even when words are separated by extra spaces", () => {
    const logs = ["Critical   system  failure detected"];
    const errorKeywords = ["critical system failure"];
    const expected = ["[REDACTED] detected"];
    expect(processLogs(logs, errorKeywords)).toEqual(expected);
  });

  test("handles multi-line logs and redacts correctly", () => {
    const logs = [
      "System started\nError detected in module\nFatal: Kernel panic",
      "User logged in\nWarning: Low battery",
    ];
    const errorKeywords = ["error", "fatal", "warning"];
    const expected = [
      "System started\n[REDACTED] detected in module\n[REDACTED]: Kernel panic",
      "User logged in\n[REDACTED]: Low battery"
    ];
    expect(processLogs(logs, errorKeywords)).toEqual(expected);
  });

  test("handles multiple overlapping error keywords correctly", () => {
    const logs = ["Critical system failure detected", "Critical failure occurred"];
    const errorKeywords = ["critical system failure", "critical failure"];
    const expected = ["[REDACTED] detected", "[REDACTED] occurred"];
    expect(processLogs(logs, errorKeywords)).toEqual(expected);
  });

  test("handles nested phrases where one error keyword is inside another", () => {
    const logs = ["Disk failure detected", "System failure occurred", "Critical system failure detected"];
    const errorKeywords = ["disk failure", "system failure", "critical system failure"];
    const expected = ["[REDACTED] detected", "[REDACTED] occurred", "[REDACTED] detected"];
    expect(processLogs(logs, errorKeywords)).toEqual(expected);
  });

  test("does not accidentally redact partial words", () => {
    const logs = ["Superior errorhandling detected", "fatalistic approach taken", "Warning! No issue here"];
    const errorKeywords = ["error", "fatal", "warning"];
    const expected = ["Superior errorhandling detected", "fatalistic approach taken", "[REDACTED]! No issue here"];
    expect(processLogs(logs, errorKeywords)).toEqual(expected);
  });

  test("redacts error keywords when they appear multiple times in the same log", () => {
    const logs = ["Error: Something went wrong. Error encountered again."];
    const errorKeywords = ["error"];
    const expected = ["[REDACTED]: Something went wrong. [REDACTED] encountered again."];
    expect(processLogs(logs, errorKeywords)).toEqual(expected);
  });

  test("handles logs where error keywords appear as part of URLs or paths", () => {
    const logs = [
      "Visit http://error.com for more details",
      "Check /var/log/fatal-errors.log for logs",
      "System warning issued at C:\\Windows\\Logs"
    ];
    const errorKeywords = ["error", "fatal", "warning"];
    const expected = [
      "Visit http://[REDACTED].com for more details",
      "Check /var/log/[REDACTED]-errors.log for logs",
      "System [REDACTED] issued at C:\\Windows\\Logs"
    ];
    expect(processLogs(logs, errorKeywords)).toEqual(expected);
  });

  test("handles redaction of case-sensitive mixed logs", () => {
    const logs = ["eRrOr detected", "WaRnInG issued", "FaTAL crash occurred"];
    const errorKeywords = ["error", "warning", "fatal"];
    const expected = ["[REDACTED] detected", "[REDACTED] issued", "[REDACTED] crash occurred"];
    expect(processLogs(logs, errorKeywords)).toEqual(expected);
  });

});