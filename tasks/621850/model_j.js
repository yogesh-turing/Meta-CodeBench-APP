function minCohesiveGroups(sequence) {
    // Initialize a stack to store the tasks
    let stack = [];

    // Iterate through the tasks in the sequence
    for (let i = 0; i < sequence.length; i++) {
        // If the stack is empty or the current task is not equal to the top of the stack
        if (stack.length === 0 || stack[stack.length - 1] !== sequence[i]) {
            // Push the current task to the stack
            stack.push(sequence[i]);
        } else {
            // If the current task is equal to the top of the stack, pop the top of the stack
            stack.pop();
        }
    }

    // The minimum number of cohesive groups is the size of the stack
    return stack.length;
}

module.exports = { minCohesiveGroups };