Model Evaluations:
    first Observed failure it partially correct. The way models trying to find the product is incorrect.
    The `propEq` function expects first parameter as value and second parameter as field name.

Incorrect Solution Explanation:
    Same as above, issue is with Rambda's `find` and `findIndex` functions.
    These functions are used in other functions `getProductById`, `updateProductQuantity`, `applyDiscount` and `deleteProduct`.
    You can provide explanation in 2-4 lines for Rambda's `find` and `findIndex` functions. Then mention other function impacted due to improper use of Rambda functions.
    Here you don't have to explain each and every test case, just explain the root cause. In this case there is one root cause.



Completed all tests for 1171511

============= TEST SUMMARY =============

1171511:
  base       : 5/23 tests passed [FAILED]
  correct    : 23/23 tests passed [PASSED]
  incorrect  : 17/23 tests passed [FAILED]
  model_a    : 17/23 tests passed [FAILED]
  model_b    : 23/23 tests passed [PASSED]
  model_c    : 17/23 tests passed [FAILED]
  model_d    : 17/23 tests passed [FAILED]
  model_e    : 17/23 tests passed [FAILED]
  model_f    : 16/23 tests passed [FAILED]
  model_g    : 16/23 tests passed [FAILED]
  model_h    : 16/23 tests passed [FAILED]
  model_i    : 16/23 tests passed [FAILED]
  model_j    : 16/23 tests passed [FAILED]
