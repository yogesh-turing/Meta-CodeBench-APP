const yup = require("yup");
const validTlds = new Set(["com", "org", "net", "edu", "gov"]);

const isValidDomain = (domain) => {
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) return false;
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
};

const emailSchema = yup.string().email().test("plus addressing", "Plus addressing is not allowed", (value) => !value.includes("+")).test("consecutive dots", "Email cannot contain consecutive dots", (value) => !value.includes("..")).test("length", "Email length must be less than 255 characters", (value) => value.length < 255).test("valid domain", "Invalid email domain format", (value) => isValidDomain(value.split("@")[1])).test("valid tld", "Email must have a valid top-level domain", (value) => validTlds.has(value.split("@")[1].split(".").pop()));

const creditCardSchema = yup.string().matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "Invalid creditCard format");

const validateData = async (data, allowedDomains = null) => {
    if (allowedDomains && (!Array.isArray(allowedDomains) || !allowedDomains.every((domain) => typeof domain === "string") || allowedDomains.length === 0)) {
        return { status: "failed", message: "Invalid allowedDomains parameter" };
    }

    try {
        await creditCardSchema.validate(data.creditCard);
    } catch (err) {
        return { status: "failed", message: err.message };
    }

    try {
        await emailSchema.validate(data.email);
    } catch (err) {
        return { status: "failed", message: err.message };
    }

    if (allowedDomains?.length) {
        const domain = data.email.split("@")[1];
        if (!allowedDomains.includes(domain)) {
            return { status: "failed", message: `Email domain must be one of: ${allowedDomains.join(", ")}` };
        }
    }

    return { status: "success", data };
};

module.exports = { validateData };