function multiplyLargeNumbers(num1, num2) {
    let x = num1.toString();
    let y = num2.toString();
    let n = x.length;
    let m = y.length;
    let max = Math.max(n, m);
    x = x.padStart(max, '0');
    y = y.padStart(max, '0');
    return karatsuba(x, y);
}

function karatsuba(x, y) {
    if (x.length === 1 || y.length === 1) {
        return parseInt(x) * parseInt(y);
    }
    let n = x.length;
    let m = Math.floor(n / 2);
    let a = x.slice(0, m);
    let b = x.slice(m);
    let c = y.slice(0, m);
    let d = y.slice(m);
    let ac = karatsuba(a, c);
    let bd = karatsuba(b, d);
    let ad_bc = karatsuba(add(a, b), add(c, d)) - ac - bd;
    let prod = ac * Math.pow(10, 2 * m) + ad_bc * Math.pow(10, m) + bd;
    return prod;
}

function add(x, y) {
    let max = Math.max(x.length, y.length);
    x = x.padStart(max, '0');
    y = y.padStart(max, '0');
    let result = '';
    let carry = 0;
    for (let i = max - 1; i >= 0; i--) {
        let sum = parseInt(x[i]) + parseInt(y[i]) + carry;
        result = (sum % 10).toString() + result;
        carry = Math.floor(sum / 10);
    }
    if (carry > 0) {
        result = carry.toString() + result;
    }
    return result;
}

module.exports = { multiplyLargeNumbers };