class FormulaCalculator {
    constructor() {
      this.variables = new Map();
      this.functions = new Map();
    }
  
    // Basic variable management
    setVariable(name, value) {
      if (typeof value !== "number") {
        throw new Error("Invalid formula");
      }
      this.variables.set(name, value);
    }
  
    getVariable(name) {
      if (!this.variables.has(name)) {
        throw new Error("Invalid formula");
      }
      return this.variables.get(name);
    }
  
    // Basic function registration
    registerFunction(name, func) {
      if (typeof func !== "function") {
        throw new Error("Invalid formula");
      }
      this.functions.set(name, func);
    }
  
    evaluate(formula) {
      if (typeof formula !== "string" || formula.trim() === "") {
        throw new Error("Invalid formula");
      }
      const tokens = this._tokenize(formula);
      return this._evaluateTokens(tokens);
    }
  
    _tokenize(formula) {
      const tokens = [];
      let position = 0;
      let hasToken = false;
      let lastWasOperator = true;
      let parenCount = 0;
  
      while (position < formula.length) {
        let char = formula[position];
  
        // Skip whitespace
        if (char === " ") {
          position++;
          continue;
        }
  
        // Numbers
        if (/[0-9.]/.test(char)) {
          let number = "";
          let hasDot = false;
  
          // Handle leading decimal point
          if (char === ".") {
            if (
              position + 1 >= formula.length ||
              !/[0-9]/.test(formula[position + 1])
            ) {
              throw new Error("Invalid formula");
            }
            number = "0";
            hasDot = true;
            number += char;
            position++;
          }
  
          while (
            position < formula.length &&
            (/[0-9]/.test(formula[position]) || formula[position] === ".")
          ) {
            if (formula[position] === ".") {
              if (hasDot) throw new Error("Invalid formula");
              hasDot = true;
            }
            number += formula[position];
            position++;
          }
  
          // Handle trailing decimal point
          if (number.endsWith(".")) throw new Error("Invalid formula");
  
          const value = parseFloat(number);
          if (isNaN(value)) throw new Error("Invalid formula");
          tokens.push({ type: "number", value });
          hasToken = true;
          lastWasOperator = false;
          continue;
        }
  
        // Operators
        if (["+", "-", "*", "/", "(", ")"].includes(char)) {
          if (char === "(" && !lastWasOperator && hasToken) {
            throw new Error("Invalid formula");
          }
          if (char === ")" && (lastWasOperator || parenCount === 0)) {
            throw new Error("Invalid formula");
          }
          if (char === "(") parenCount++;
          if (char === ")") parenCount--;
  
          tokens.push({ type: "operator", value: char });
          lastWasOperator = char !== ")";
          if (char === "(") hasToken = false;
          if (char === ")") hasToken = true;
          position++;
          continue;
        }
  
        // Variables and Functions
        if (/[a-zA-Z]/.test(char)) {
          let name = "";
          while (
            position < formula.length &&
            /[a-zA-Z0-9_]/.test(formula[position])
          ) {
            name += formula[position];
            position++;
          }
  
          // Skip whitespace after name
          let tempPos = position;
          let hasSpace = false;
          while (tempPos < formula.length && formula[tempPos] === " ") {
            hasSpace = true;
            tempPos++;
          }
  
          // Check if it's a function call
          if (tempPos < formula.length && formula[tempPos] === "(") {
            if (hasSpace) throw new Error("Invalid formula");
            tokens.push({ type: "function", value: name });
            position = tempPos;
            lastWasOperator = true;
          } else {
            tokens.push({ type: "variable", value: name });
            lastWasOperator = false;
          }
          hasToken = true;
          continue;
        }
  
        // Commas for function arguments
        if (char === ",") {
          if (!hasToken || lastWasOperator) throw new Error("Invalid formula");
          tokens.push({ type: "comma", value: "," });
          position++;
          hasToken = false;
          lastWasOperator = true;
          continue;
        }
  
        throw new Error("Invalid formula");
      }
  
      if (
        parenCount !== 0 ||
        (lastWasOperator &&
          tokens.length > 0 &&
          tokens[tokens.length - 1].value !== ")")
      ) {
        throw new Error("Invalid formula");
      }
  
      return tokens;
    }
  
    _evaluateTokens(tokens) {
      const output = [];
      const operators = [];
      const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
      };
  
      const evaluateTop = () => {
        const operator = operators.pop();
        if (operator.type === "function") {
          const argsCount = operator.argsCount || 1;
          if (output.length < argsCount) {
            throw new Error("Invalid formula");
          }
          const args = [];
          for (let i = 0; i < argsCount; i++) {
            args.unshift(output.pop());
          }
          const func = this.functions.get(operator.value);
          if (!func) {
            throw new Error("Invalid formula");
          }
          const result = func(...args);
          if (typeof result !== "number" || isNaN(result)) {
            throw new Error("Invalid formula");
          }
          output.push(result);
        } else {
          this._applyOperator(output, operator);
        }
      };
  
      for (const token of tokens) {
        switch (token.type) {
          case "number":
            output.push(token.value);
            break;
  
          case "variable":
            output.push(this.getVariable(token.value));
            break;
  
          case "function":
            operators.push({ ...token, argsCount: 0 });
            break;
  
          case "operator":
            if (token.value === "(") {
              operators.push(token);
            } else if (token.value === ")") {
              while (
                operators.length > 0 &&
                operators[operators.length - 1].value !== "("
              ) {
                evaluateTop();
              }
              if (operators.length === 0) {
                throw new Error("Invalid formula");
              }
              operators.pop(); // Remove "("
              if (
                operators.length > 0 &&
                operators[operators.length - 1].type === "function"
              ) {
                operators[operators.length - 1].argsCount++;
                evaluateTop();
              }
            } else {
              while (
                operators.length > 0 &&
                operators[operators.length - 1].value !== "(" &&
                precedence[operators[operators.length - 1].value] >=
                  precedence[token.value]
              ) {
                evaluateTop();
              }
              operators.push(token);
            }
            break;
  
          case "comma":
            while (
              operators.length > 0 &&
              operators[operators.length - 1].value !== "("
            ) {
              evaluateTop();
            }
            if (
              operators.length === 0 ||
              operators[operators.length - 1].value !== "("
            ) {
              throw new Error("Invalid formula");
            }
            if (
              operators.length < 2 ||
              operators[operators.length - 2].type !== "function"
            ) {
              throw new Error("Invalid formula");
            }
            operators[operators.length - 2].argsCount++;
            break;
        }
      }
  
      while (operators.length > 0) {
        if (operators[operators.length - 1].value === "(") {
          throw new Error("Invalid formula");
        }
        evaluateTop();
      }
  
      if (output.length !== 1) {
        throw new Error("Invalid formula");
      }
  
      return output[0];
    }
  
    _applyOperator(stack, operator) {
      if (stack.length < 2) {
        throw new Error("Invalid formula");
      }
  
      const b = stack.pop();
      const a = stack.pop();
  
      if (typeof a !== "number" || typeof b !== "number") {
        throw new Error("Invalid formula");
      }
  
      switch (operator.value) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          if (b === 0) throw new Error("Invalid formula");
          stack.push(a / b);
          break;
        default:
          throw new Error("Invalid formula");
      }
    }
  }
  
  module.exports = { FormulaCalculator };