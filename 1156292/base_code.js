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
  paymentType: yup.number().required("Payment type is requred"),
  category: yup.string(),
  categoryType: yup
    .number()
    .default(0)
    .required("Category type is required")
    .oneOf([0, 1]), // 0 is Entity, 1 is Other
  invoiceIDs: yup.array(yup.string()).max(5),
  clientID: yup.string(),
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
  paymentType: yup.number().required("Payment type is requred").oneOf([0, 1]), // 0 is Incoming, 1 is outgoing
  category: yup.string(),
  categoryType: yup
    .number()
    .default(0)
    .required("Category type is required")
    .oneOf([0, 1]), // 0 is Entity, 1 is Other
  orderIDs: yup.array(yup.string()).max(5),
  vendorID: yup.string(),
});

const validate = async (payment) => {
  if (payment.paymentType === undefined)
    throw { errors: ["Payment type is required"] };

  if (payment.paymentType === 0) {
    await PaymentIncomingSchema.validate(payment);
    if (payment.categoryType === 0 && payment.reason === 0) {
      if (!payment.invoiceIDs) throw { errors: ["Invoice ID is required"] };
      if (payment.invoiceIDs.length === 0)
        throw { errors: ["Invoice ID must include at least one ID"] };

      if (!payment.clientID) throw { errors: ["Client ID is required"] };
    }
  }
  if (payment.paymentType === 1) {
    await PaymentOutgoingSchema.validate(payment);
    if (payment.categoryType === 0 && payment.reason === 0) {
      if (!payment.orderIDs) throw { errors: ["Order ID is required"] };
      if (payment.orderIDs.length === 0)
        throw { errors: ["Order ID must include at least one ID"] };

      if (!payment.vendorID) throw { errors: ["Vendor ID is required"] };
    }
  }
};


module.exports = { validate };