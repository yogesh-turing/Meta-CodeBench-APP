const yup = require('yup');

const validTlds = new Set(["com", "org", "net", "edu", "gov"]);
const validEmailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const validDomainFormat = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const validCreditCardFormat = /^\d{4}-\d{4}-\d{4}-\d{4}$/;

const emailSchema = yup.string()
    .required()
    .matches(validEmailFormat, 'Invalid email format')
    .test('plus addressing', 'Plus addressing is not allowed', (email) => !email.includes("+"))
    .test('consecutive dots', 'Email cannot contain consecutive dots', (email) => !email.includes(".."))
    .test('length', 'Email length must be less than 255 characters', (email) => email.length < 255)
    .test('domain', 'Invalid email domain format', (email) => {
        const domain = email.split("@")[1];
        return validDomainFormat.test(domain);
    })
    .test('tld', 'Email must have a valid top-level domain', (email) => {
        const tld = email.split('.').pop();
        return validTlds.has(tld);
    });

const creditCardSchema = yup.string()
    .required()
    .matches(validCreditCardFormat, 'Invalid creditCard format');

const validateData = async (data, allowedDomains = null) => {
    if (allowedDomains && (!Array.isArray(allowedDomains) || !allowedDomains.every((domain) => typeof domain === "string") || allowedDomains.length === 0)) {
        return { status: "failed", message: "Invalid allowedDomains parameter" };
    }

    const schema = yup.object().shape({
        email: emailSchema,
        creditCard: creditCardSchema,
    });

    if (allowedDomains?.length) {
        schema.fields.email.test('allowedDomains', `Email domain must be one of: ${allowedDomains.join(", ")}`, (email) => {
            const domain = email.split("@")[1];
            return allowedDomains.includes(domain);
        });
    }

    try {
        await schema.validate(data);
        return { status: "success", data };
    } catch (error) {
        return { status: "failed", message: error.message };
    }
};

module.exports = { validateData };