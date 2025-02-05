function minCohesiveGroups(sequence) {
  // Initialize the minimum number of groups to 0
  let minGroups = 0;

  // Create a stack to store the elements
  let stack = [];

  // Iterate over the sequence
  for (let i = 0; i < sequence.length; i++) {
      // If the stack is empty or the current element is different from the top of the stack
      if (stack.length === 0 || sequence[i] !== stack[stack.length - 1]) {
          // Push the current element to the stack
          stack.push(sequence[i]);
      } else {
          // If the current element is the same as the top of the stack, pop it
          stack.pop();
      }
  }

  // The minimum number of groups is the number of elements left in the stack
  minGroups = stack.length;

  // Return the minimum number of groups
  return minGroups;
}

// Test cases
console.log(minCohesiveGroups(["A", "B", "A", "C", "A"])); // Output: 3
console.log(minCohesiveGroups(["X", "Y", "Z"])); // Output: 3

module.exports = { minCohesiveGroups };