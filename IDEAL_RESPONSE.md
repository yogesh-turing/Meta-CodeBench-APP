The incorrect solution throws an error when `totalPrice` does not match the sum of the item totals, when `totalPrice` is less than 100 with a `discountCode`, or when the `paymentDetails` object is invalid or contains both payment methods. 

In comparision with incorrect solution the ideal solution used a combination of `custom` functions and `messages` to fulfill the requirement.

If validation fails in any custom function, it returns Joi's `ErrorReport` object using the `helpers.error` function with an error code string. A configured message object maps the error code to the corresponding string message, ensuring that the required error messages are returned correctly.
