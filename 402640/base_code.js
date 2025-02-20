class Solution {
    static isReacheable(start, end, n) {
        // fill in the code
    }

    static sameDiagonal(sX, sY, eX, eY) {
        return (Math.abs(sX - sY) === Math.abs(eX - eY)) || (sX + sY === eX + eY);
    }
}
module.exports = { Solution };