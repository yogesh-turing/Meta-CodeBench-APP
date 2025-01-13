Base Code:
```javascript
function flattenArr(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flattenArray(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

const nestedArray = [1, [2, [3, [4, [5]]]]];
console.log(flattenArr(nestedArray)); // [1, 2, 3, 4, 5]

module.exports = { flattenArr };
```

Prompt:
I am having performance issues when trying to flatten very deeply nested arrays and giving the error "RangeError: Maximum call stack size exceeded". The existing algorithm is also failing at non-array inputs. 

Please provide a more optimized algorithm to solve the issues. 
