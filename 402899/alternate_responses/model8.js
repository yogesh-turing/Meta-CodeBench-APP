class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // Check if the input string contains non-numeric data
        if (!/^\d+$/.test(numbers)) {
            throw new Error("Input string contains non-numeric data");
        }

        // Initialize the current position to the first character
        let currentPosition = 0;

        // Convert the input string to an array for easier manipulation
        let numbersArray = numbers.split("");

        // Iterate over each action in the actions string
        for (let action of actions) {
            // Check if the action is a swap action
            if (action.startsWith("S")) {
                // Extract the position to swap with
                let swapPosition = parseInt(action.slice(1)) - 1;

                // Swap the current position with the swap position
                [numbersArray[currentPosition], numbersArray[swapPosition]] = [numbersArray[swapPosition], numbersArray[currentPosition]];
            } else {
                // Handle other actions (R, L, T, D)
                switch (action) {
                    case "R":
                        // Move to the next character
                        currentPosition = Math.min(currentPosition + 1, numbersArray.length - 1);
                        break;
                    case "L":
                        // Move to the previous character
                        currentPosition = Math.max(currentPosition - 1, 0);
                        break;
                    case "T":
                        // Increment the digit by one
                        numbersArray[currentPosition] = (parseInt(numbersArray[currentPosition]) + 1).toString();
                        if (numbersArray[currentPosition] === "10") {
                            numbersArray[currentPosition] = "9";
                        }
                        break;
                    case "D":
                        // Decrement the digit by one
                        numbersArray[currentPosition] = (parseInt(numbersArray[currentPosition]) - 1).toString();
                        if (numbersArray[currentPosition] === "-1") {
                            numbersArray[currentPosition] = "0";
                        }
                        break;
                }
            }
        }

        // Return the transformed numbers as a string
        return numbersArray.join("");
    }
}

module.exports = { DocumentEncryptor };