```javascript

```
---------------------------------------------------------------------------------------------------
Model f
---------------------------------------------------------------------------------------------------
The model failed to validate correctly input data objects only with a valid email address.
The functions threw an error that `creditCard` field is required. 
The `creditCard` field is optional, if `creditCard` field is present in the input data object then only it should validate.

---------------------------------------------------------------------------------------------------
Model E
---------------------------------------------------------------------------------------------------
The model failed to validate email addresses with spaces.
The function should throw an error if the email address has space, instead function returns status = 'success; 


---------------------------------------------------------------------------------------------------
Model D
---------------------------------------------------------------------------------------------------
The model failed to evaluate `allowedDomains` array for not string values. 
The `allowedDomains` array should be a strings array only having allowed domain values.


---------------------------------------------------------------------------------------------------
Model C
---------------------------------------------------------------------------------------------------
The model failed to validate the credit card number of the empty string.
If a credit card number is present in the data and it is empty the function should throw an error.
---------------------------------------------------------------------------------------------------
Model B
---------------------------------------------------------------------------------------------------
The model failed to evaluate `allowedDomains` array for not string values. 
The `allowedDomains` array should be a strings array only having allowed domain values.


---------------------------------------------------------------------------------------------------
Model A
---------------------------------------------------------------------------------------------------
The model failed to validate the credit card number of the empty string.
If a credit card number is present in the data and it is empty the function should throw an error.