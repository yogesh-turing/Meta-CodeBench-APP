"Hasnat:
- Incorrect solution had unit tests pasted instead of code.

- The models are working individually but giving different results when run using script mostly "" should persist calculation log asynchronously"" test is exceeding timeout, the ""10000"" value in the unit test should not be there.
- This is not a good practise, instead of using 10000 use jestfaketimers to move time by the amount required as ""persistCalculationLog"" is using timeout."