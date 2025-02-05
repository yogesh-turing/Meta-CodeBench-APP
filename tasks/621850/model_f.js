function minCohesiveGroups(sequence) {
    let count = 0;
    let left = 0;
    let right = sequence.length - 1;

    while (left <= right) {
        if (sequence[left] === sequence[right]) {
            left++;
            right--;
        } else {
            count++;
            left++;
        }
    }

    return count + 1;
}

module.exports = { minCohesiveGroups };