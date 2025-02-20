const yup = require("yup");

const PaymentIncomingSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .min(1, "Amount must be greater than 0"),
  paymentDate: yup.date().required("Payment date is required"),
  status: yup.number(),
  reason: yup.number().nullable().oneOf([0, 1]), // 0 is Advance, 1 is Item
  paymentMode: yup.number().required("Payment mode is required"),
  description: yup.string(),
  assetID: yup.string(),
  paymentType: yup.number().required("Payment type is required").equals([0]),
  category: yup.string(),
  categoryType: yup
    .number()
    .default(0)
    .required("Category type is required")
    .oneOf([0, 1]), // 0 is Entity, 1 is Other
  invoiceIDs: yup
    .array(yup.string())
    .max(5)
    .when(["categoryType", "reason"], {
      is: (categoryType, reason) => categoryType === 0 && reason === 0,
      then: yup
        .array()
        .min(1, "Invoice ID must include at least one ID")
        .required("Invoice ID is required"),
    }),
  clientID: yup.string().when(["categoryType", "reason"], {
    is: (categoryType, reason) => categoryType === 0 && reason === 0,
    then: yup.string().required("Client ID is required"),
  }),
});

const PaymentOutgoingSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .min(1, "Amount must be greater than 0"),
  paymentDate: yup.date().required("Payment date is required"),
  status: yup.number(),
  reason: yup.number().nullable().oneOf([0, 1]), // 0 is Advance, 1 is Item
  paymentMode: yup.number().required("Payment mode is required").oneOf([0, 1]), // 0 is bank transfer, 1 is cash
  description: yup.string(),
  assetID: yup.string(),
  paymentType: yup.number().required("Payment type is required").equals([1]),
  category: yup.string(),
  categoryType: yup
    .number()
    .default(0)
    .required("Category type is required")
    .oneOf([0, 1]), // 0 is Entity, 1 is Other
  orderIDs: yup
    .array(yup.string())
    .max(5)
    .when(["categoryType", "reason"], {
      is: (categoryType, reason) => categoryType === 0 && reason === 0,
      then: yup
        .array()
        .min(1, "Order ID must include at least one ID")
        .required("Order ID is required"),
    }),
  vendorID: yup.string().when(["categoryType", "reason"], {
    is: (categoryType, reason) => categoryType === 0 && reason === 0,
    then: yup.string().required("Vendor ID is required"),
  }),
});

const validate = async (payment) => {
  if (payment.paymentType === 0) {
    await PaymentIncomingSchema.validate(payment);
  } else {
    await PaymentOutgoingSchema.validate(payment);
  }
};

module.exports = { validate };
