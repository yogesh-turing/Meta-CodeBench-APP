function minCohesiveGroups(sequence) {
    let cohesiveGroups = 0;
    let i = 0;
    while (i < sequence.length) {
        let j = i + 1;
        while (j < sequence.length && sequence[j] !== sequence[i]) {
            j++;
        }
        if (j < sequence.length) {
            cohesiveGroups++;
            i = j + 1;
        } else {
            cohesiveGroups++;
            i++;
        }
    }
    return cohesiveGroups;
}

module.exports = { minCohesiveGroups };