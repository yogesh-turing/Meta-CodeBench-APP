const yup = require("yup");

const PAYMENT_TYPES = { INCOMING: 0, OUTGOING: 1 };
const CATEGORY_TYPES = { ENTITY: 0, OTHER: 1 };
const REASONS = { ADVANCE: 0, ITEM: 1 };
const PAYMENT_MODES = { BANK_TRANSFER: 0, CASH: 1 };

const PaymentSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .min(1, "Amount must be greater than 0"),
  paymentDate: yup.date().required("Payment date is required"),
  status: yup.number(),
  reason: yup.number().nullable().oneOf([REASONS.ADVANCE, REASONS.ITEM]),
  paymentMode: yup
    .number()
    .required("Payment mode is required")
    .when("paymentType", {
      is: PAYMENT_TYPES.OUTGOING,
      then: (schema) => schema.oneOf([PAYMENT_MODES.BANK_TRANSFER, PAYMENT_MODES.CASH]),
    }),
  description: yup.string(),
  assetID: yup.string(),
  paymentType: yup.number().required("Payment type is required").oneOf([PAYMENT_TYPES.INCOMING, PAYMENT_TYPES.OUTGOING]),
  category: yup.string(),
  categoryType: yup
    .number()
    .default(CATEGORY_TYPES.ENTITY)
    .required("Category type is required")
    .oneOf([CATEGORY_TYPES.ENTITY, CATEGORY_TYPES.OTHER]),
  invoiceIDs: yup
    .array(yup.string())
    .max(5)
    .when(["paymentType", "categoryType", "reason"], {
      is: (paymentType, categoryType, reason) =>
        paymentType === PAYMENT_TYPES.INCOMING && categoryType === CATEGORY_TYPES.ENTITY && reason === REASONS.ADVANCE,
      then: (schema) =>
        schema
          .required("Invoice ID is required")
          .min(1, "Invoice ID must include at least one ID"),
    }),
  orderIDs: yup
    .array(yup.string())
    .max(5)
    .when(["paymentType", "categoryType", "reason"], {
      is: (paymentType, categoryType, reason) =>
        paymentType === PAYMENT_TYPES.OUTGOING && categoryType === CATEGORY_TYPES.ENTITY && reason === REASONS.ADVANCE,
      then: (schema) =>
        schema
          .required("Order ID is required")
          .min(1, "Order ID must include at least one ID"),
    }),
  clientID: yup.string().when(["paymentType", "categoryType", "reason"], {
    is: (paymentType, categoryType, reason) =>
      paymentType === PAYMENT_TYPES.INCOMING && categoryType === CATEGORY_TYPES.ENTITY && reason === REASONS.ADVANCE,
    then: (schema) => schema.required("Client ID is required"),
  }),
  vendorID: yup.string().when(["paymentType", "categoryType", "reason"], {
    is: (paymentType, categoryType, reason) =>
      paymentType === PAYMENT_TYPES.OUTGOING && categoryType === CATEGORY_TYPES.ENTITY && reason === REASONS.ADVANCE,
    then: (schema) => schema.required("Vendor ID is required"),
  }),
});

const validate = async (payment) => {
  await PaymentSchema.validate(payment);
};

module.exports = { validate };
