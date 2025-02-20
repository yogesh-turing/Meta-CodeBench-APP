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

const PaymentSchema = yup.object().when("paymentType", {
  is: 0,
  then: PaymentIncomingSchema.concat(
    yup.object({
      invoiceIDs: yup.array(yup.string()).when("categoryType", {
        is: 0,
        then: yup.array(yup.string()).required("Invoice ID is required").min(1, "Invoice ID must include at least one ID"),
        otherwise: yup.array(yup.string()),
      }),
      clientID: yup.string().when("categoryType", {
        is: 0,
        then: yup.string().required("Client ID is required"),
        otherwise: yup.string(),
      }),
    })
  ),
  otherwise: PaymentOutgoingSchema.concat(
    yup.object({
      orderIDs: yup.array(yup.string()).when("categoryType", {
        is: 0,
        then: yup.array(yup.string()).required("Order ID is required").min(1, "Order ID must include at least one ID"),
        otherwise: yup.array(yup.string()),
      }),
      vendorID: yup.string().when("categoryType", {
        is: 0,
        then: yup.string().required("Vendor ID is required"),
        otherwise: yup.string(),
      }),
    })
  ),
});

const validate = async (payment) => {
  await PaymentSchema.validate(payment);
};

module.exports = { validate };