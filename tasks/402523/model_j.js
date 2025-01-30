const yup = require("yup");
const validTlds = new Set(["com", "org", "net", "edu", "gov"]);

const emailSchema = yup.string().required().email().test("plus addressing", "Plus addressing is not allowed", (value) => !value.includes("+"))
    .test("consecutive dots", "Email cannot contain consecutive dots", (value) => !value.includes(".."))
    .test("length", "Email length must be less than 255 characters", (value) => value.length <= 254)
    .test("domain", "Invalid email domain format", (value) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.split("@")[1]))
    .test("tld", "Email must have a valid top-level domain", (value) => validTlds.has(value.split(".").pop()));

const creditCardSchema = yup.string().required().test("format", "Invalid creditCard format", (value) => /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(value));

const validateData = async (data, allowedDomains = null) => {
    if (allowedDomains && (!Array.isArray(allowedDomains) || !allowedDomains.every((domain) => typeof domain === "string") || allowedDomains.length === 0)) {
        return { status: "failed", message: "Invalid allowedDomains parameter" };
    }

    try {
        await emailSchema.validate(data.email);
        await creditCardSchema.validate(data.creditCard);

        if (allowedDomains?.length) {
            const domain = data.email.split("@")[1];
            if (!allowedDomains.includes(domain)) {
                return { status: "failed", message: `Email domain must be one of: ${allowedDomains.join(", ")}` };
            }
        }
    } catch (error) {
        return { status: "failed", message: error.message };
    }

    return { status: "success", data };
};

module.exports = { validateData };