function multiplyLargeNumbers(num1, num2) {
  num1 = num1.toString();
  num2 = num2.toString();
  let result = new Array(num1.length + num2.length).fill(0);
  for (let i = num1.length - 1; i >= 0; i--) {
    for (let j = num2.length - 1; j >= 0; j--) {
      let mul = parseInt(num1[i]) * parseInt(num2[j]);
      let p1 = i + j;
      let p2 = i + j + 1;
      let sum = mul + result[p2];
      result[p1] += Math.floor(sum / 10);
      result[p2] = sum % 10;
    }
  }
  let res = "";
  for (let i = 0; i < result.length; i++) {
    if (!(res === "" && result[i] === 0)) {
      res += result[i];
    }
  }
  return res === "" ? 0 : parseInt(res);
}

module.exports = { multiplyLargeNumbers };