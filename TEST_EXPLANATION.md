```javascript

```

The `validateOrder` function failed to return output in correct format.
The function returned the errors in `errors` field instead of `error` field.

```javascript
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return {
      success: false,
      errors: errorMessages
    };
  }
```

-----------------

The `validateOrder` function failed to validate customer age.
If customer age is less that 18 then it should return false with error message. The function returned true.
There seems to be issue with customerAge validation configuration.

```javascript
  customerAge: Joi.number().integer().optional().when('items', {
    is: Joi.array().items(Joi.object({
      ageRestricted: Joi.boolean().valid(true).required()
    })),
    then: Joi.number().integer().min(18).required().messages({
      'number.min': ERRORS.INVALID_CUSTOMER_AGE,
    })
  })
```

----------------


For valid payload, the function `validateOrder` should return `true` 

The function returned false with an error message as 

'"paymentDetails.creditCard" must contain at least one of [paypal], Invalid PayPal ID"'

Issue is with `paymentDetails.creditCard` validation, it used `xor` function incorrectly.

```javascript
creditCard: Joi.object({
      cardNumber: Joi.string().regex(/^[0-9]{16}$/).required().messages({
        'string.base': ERRORS.INVALID_CREDIT_CARD_NUMBER,
        'string.regex.base': ERRORS.INVALID_CREDIT_CARD_NUMBER,
        'any.required': ERRORS.INVALID_CREDIT_CARD_NUMBER
      }),
      expiryDate: Joi.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/).required().messages({
        'string.base': ERRORS.INVALID_EXPIRY_DATE,
        'string.regex.base': ERRORS.INVALID_EXPIRY_DATE,
        'any.required': ERRORS.INVALID_EXPIRY_DATE
      }),
      cvv: Joi.string().regex(/^[0-9]{3}$/).required().messages({
        'string.base': ERRORS.INVALID_CVV,
        'string.regex.base': ERRORS.INVALID_CVV,
        'any.required': ERRORS.INVALID_CVV
      })
    }).xor('paypal'),
```

----

For valid payload, the function `validateOrder` should return `true` 

The function returned false with an error message as 

"Invalid customer name"

The issue is with `customerNameSchema` regex

```javascript
const customerNameSchema = Joi.string().required().pattern(/^[a-zA-Z]+$/);
```
This regex returns false if the customer name has space.

----


The `validateOrder` function should throw an error that starts with 'Invalid total price' when the total price does not match the item's total cost.

The function returned an error as 

'"value" contains an invalid value

The issue is on line number 154

```javascript
  if (value.totalPrice !== calculatedTotal) {
    return helpers.error('any.invalid');
  }
```
It should have returned the `ERRORS.INVALID_TOTAL_PRICE`





The `validateOrder` function should throw an error that starts with 'Invalid total price' when the total price does not match the item's total cost.

The function returned an error as 

'"totalPrice" failed custom validation because Invalid total price'


The issue is with `totalPrice` field validation on `orderSchema`

```javascript
  discountCode: Joi.string()
    .optional()
    .custom((value, helpers) => {
      const totalPrice = helpers.state.ancestors[0].totalPrice;
      if (value && totalPrice < 100) {
        throw new Error(ERRORS.INVALID_DISCOUNT_CODE);
      }
      return value;
    })
```

It has thrown error, it should handled it differently. It could have used `helpers.error('any.invalid');` then mapping 'any.invalid' string with `ERRORS.INVALID_DISCOUNT_CODE` in messages function on `Joi.string()`


------------------


The `validateOrder` function should throw an error that starts with 'Invalid total price' when the total price does not match the item's total cost.

The function returned an error as 

'"totalPrice" failed custom validation because Invalid total price'


The issue is with `totalPrice` field validation on `orderSchema`

```javascript
totalPrice: Joi.number()
    .positive()
    .required()
    .custom((value, helpers) => {
      const items = helpers.state.ancestors[0].items;
      const calculatedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (value !== calculatedTotal) {
        throw new Error(ERRORS.INVALID_TOTAL_PRICE);
      }
      return value;
    })
```

It has thrown an error, it should handled differently. It could have used `helpers.error('any.invalid');` then mapping 'any.invalid' string with `ERRORS.INVALID_DISCOUNT_CODE` in messages function on `Joi.string()`


--------------

The `validateOrder` function should throw an error that starts with 'Invalid total price' when the total price does not match the item's total cost.

The function returned an error as 

'"value" contains an invalid value'

The issue is on line number 156

```javascript
if (value.totalPrice !== calculatedTotal) {
    return helpers.error('any.invalid');
  }
```
It should have returned the `helpers.message(ERRORS.INVALID_TOTAL_PRICE)`





--------------

The `validateOrder` function should throw an error that starts with 'Invalid order Id' for an invalid order ID in the payload.

The function returned an error as 

'"orderId" with value "123" fails to match the Invalid order Id pattern'

The issue is on line number 27

```javascript
  orderId: Joi.string().required().regex(/^[a-zA-Z0-9]{8,12}$/, { name: 'Invalid order Id' }),
```

It should have used Joi's messages function to map error codes with error messages.




