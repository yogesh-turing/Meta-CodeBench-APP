"Completed all tests for 402509
============= TEST SUMMARY =============
402509:
  base       : 0/7 tests passed [FAILED]
  correct    : 7/7 tests passed [PASSED]
  incorrect  : 1/7 tests passed [FAILED]
  model_a    : 7/7 tests passed [PASSED]
  model_b    : 7/7 tests passed [PASSED]
  model_c    : 7/7 tests passed [PASSED]
  model_d    : 7/7 tests passed [PASSED]
  model_e    : 7/7 tests passed [PASSED]
  model_f    : 7/7 tests passed [PASSED]
  model_g    : 2/7 tests passed [FAILED]
  model_h    : 3/7 tests passed [FAILED]
  model_i    : 2/7 tests passed [FAILED]
  model_j    : 5/7 tests passed [FAILED]
All test runs completed!"



The model failed to return the array of objects in a given format when month and/or year are passed as a number string to the `getMonthlyCalendar` function.
The model returned the value of the year as `string` instead of `number`.



The model failed to return the array of objects in a given format when month and/or year are passed as a number string to the `getMonthlyCalendar` function. The model throws an error when year and/or month passed as number string.
The model should convert the string to the equivalent month.
