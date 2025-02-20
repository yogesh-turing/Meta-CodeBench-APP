const yup = require("yup");

const PaymentSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .min(1, "Amount must be greater than 0"),
  paymentDate: yup.date().required("Payment date is required"),
  status: yup.number(),
  reason: yup.number().nullable().oneOf([0, 1]), // 0 is Advance, 1 is Item
  paymentMode: yup
    .number()
    .required("Payment mode is required")
    .when('paymentType', {
      is: 1,
      then: (schema) => schema.oneOf([0, 1]) // 0 is bank transfer, 1 is cash (only for outgoing)
    }),
  description: yup.string(),
  assetID: yup.string(),
  paymentType: yup.number().required("Payment type is required").oneOf([0, 1]), // 0 is Incoming, 1 is outgoing
  category: yup.string(),
  categoryType: yup
    .number()
    .default(0)
    .required("Category type is required")
    .oneOf([0, 1]), // 0 is Entity, 1 is Other
  invoiceIDs: yup.array(yup.string()).max(5)
    .when(['paymentType', 'categoryType', 'reason'], {
      is: (paymentType, categoryType, reason) => 
        paymentType === 0 && categoryType === 0 && reason === 0,
      then: (schema) => schema.required("Invoice ID is required").min(1, "Invoice ID must include at least one ID")
    }),
  orderIDs: yup.array(yup.string()).max(5)
    .when(['paymentType', 'categoryType', 'reason'], {
      is: (paymentType, categoryType, reason) => 
        paymentType === 1 && categoryType === 0 && reason === 0,
      then: (schema) => schema.required("Order ID is required").min(1, "Order ID must include at least one ID")
    }),
  clientID: yup.string()
    .when(['paymentType', 'categoryType', 'reason'], {
      is: (paymentType, categoryType, reason) => 
        paymentType === 0 && categoryType === 0 && reason === 0,
      then: (schema) => schema.required("Client ID is required")
    }),
  vendorID: yup.string()
    .when(['paymentType', 'categoryType', 'reason'], {
      is: (paymentType, categoryType, reason) => 
        paymentType === 1 && categoryType === 0 && reason === 0,
      then: (schema) => schema.required("Vendor ID is required")
    })
});

const validate = async (payment) => {
  await PaymentSchema.validate(payment);
};

module.exports = { validate };