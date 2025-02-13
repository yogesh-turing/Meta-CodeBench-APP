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
      case "(":
      case ")":
        break;
      default:
        throw new Error("Invalid formula");
    }
  }

  _evaluateTokens(tokens) {
    const operatorStack = [];
    const outputStack = [];

    const precedence = {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2,
    };

    for (const token of tokens) {
      switch (token.type) {
        case "number":
          outputStack.push(token.value);
          break;
        case "variable":
          if (!this.variables.has(token.value)) {
            throw new Error("Invalid formula");
          }
          outputStack.push(this.variables.get(token.value));
          break;
        case "function":
          operatorStack.push(token);
          break;
        case "operator":
          while (
            operatorStack.length > 0 &&
            operatorStack[operatorStack.length - 1].type === "operator" &&
            precedence[operatorStack[operatorStack.length - 1].value] >=
              precedence[token.value]
          ) {
            this._applyOperator(outputStack, operatorStack.pop());
          }
          operatorStack.push(token);
          break;
        case "comma":
          while (
            operatorStack.length > 0 &&
            operatorStack[operatorStack.length - 1].type !== "function"
          ) {
            this._applyOperator(outputStack, operatorStack.pop());
          }
          break;
        case "paren":
          if (token.value === "(") {
            operatorStack.push(token);
          } else {
            while (
              operatorStack.length > 0 &&
              operatorStack[operatorStack.length - 1].value !== "("
            ) {
              this._applyOperator(outputStack, operatorStack.pop());
            }
            if (
              operatorStack.length === 0 ||
              operatorStack[operatorStack.length - 1].value !== "("
            ) {
              throw new Error("Invalid formula");
            }
            operatorStack.pop();
            if (
              operatorStack.length > 0 &&
              operatorStack[operatorStack.length - 1].type === "function"
            ) {
              const func = this.functions.get(
                operatorStack[operatorStack.length - 1].value
              );
              if (typeof func !== "function") {
                throw new Error("Invalid formula");
              }
              const args = [];
              while (
                outputStack.length > 0 &&
                typeof outputStack[outputStack.length - 1] === "number"
              ) {
                args.push(outputStack.pop());
              }
              args.reverse();
              const result = func(...args);
              if (typeof result !== "number") {
                throw new Error("Invalid formula");
              }
              outputStack.push(result);
              operatorStack.pop();
            }
          }
          break;
      }
    }

    while (operatorStack.length > 0) {
      this._applyOperator(outputStack, operatorStack.pop());
    }

    if (outputStack.length !== 1) {
      throw new Error("Invalid formula");
    }

    return outputStack[0];
  }

  evaluate(formula) {
    if (typeof formula !== "string") {
      throw new Error("Invalid formula");
    }
    const tokens = this._tokenize(formula);
    return this._evaluateTokens(tokens);
  }
}

module.exports = { FormulaCalculator };