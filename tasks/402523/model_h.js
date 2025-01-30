const yup = require('yup');

const validTlds = new Set(["com", "org", "net", "edu", "gov"]);

const emailSchema = yup.string()
    .email()
    .test('plus addressing', 'Plus addressing is not allowed', (value) => !value.includes('+'))
    .test('consecutive dots', 'Email cannot contain consecutive dots', (value) => !value.includes('..'))
    .test('length', 'Email length must be less than 255 characters', (value) => value.length < 255)
    .test('domain', 'Invalid email domain format', (value) => {
        const domain = value.split('@')[1];
        return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
    })
    .test('tld', 'Email must have a valid top-level domain', (value) => {
        const domain = value.split('@')[1];
        const tld = domain.split('.').pop();
        return validTlds.has(tld);
    });

const creditCardSchema = yup.string().matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, 'Invalid creditCard format');

const validateData = async (data, allowedDomains) => {
    if (allowedDomains && (!Array.isArray(allowedDomains) || !allowedDomains.every((domain) => typeof domain === "string") || allowedDomains.length === 0)) {
        return { status: "failed", message: "Invalid allowedDomains parameter" };
    }

    try {
        const schema = yup.object({
            email: emailSchema,
            creditCard: creditCardSchema,
        });

        await schema.validate(data);

        if (allowedDomains?.length) {
            const domain = data.email.split('@')[1];
            if (!allowedDomains.includes(domain)) {
                return { status: "failed", message: `Email domain must be one of: ${allowedDomains.join(', ')}` };
            }
        }

        return { status: "success", data };
    } catch (error) {
        return { status: "failed", message: error.message };
    }
};

module.exports = { validateData };