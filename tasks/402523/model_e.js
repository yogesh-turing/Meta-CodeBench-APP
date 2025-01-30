const yup = require('yup');

const validTlds = new Set(["com", "org", "net", "edu", "gov"]);

const isValidDomain = (domain) => {
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) return false;
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
};

const createSchema = (allowedDomains = null) => {
    // Validate allowedDomains parameter
    if (allowedDomains !== null) {
        if (!Array.isArray(allowedDomains) || 
            !allowedDomains.every((domain) => typeof domain === "string") || 
            allowedDomains.length === 0) {
            throw new Error("Invalid allowedDomains parameter");
        }
    }

    return yup.object().shape({
        email: yup
            .string()
            .required()
            .max(254, "Email length must be less than 255 characters")
            .test('no-plus-addressing', 'Plus addressing is not allowed', 
                value => !value.includes('+'))
            .test('no-consecutive-dots', 'Email cannot contain consecutive dots', 
                value => !value.includes('..'))
            .test('valid-domain-format', 'Invalid email domain format', 
                value => {
                    const domain = value.split('@')[1];
                    return isValidDomain(domain);
                })
            .test('valid-tld', 'Email must have a valid top-level domain', 
                value => {
                    const domain = value.split('@')[1];
                    const tld = domain.split('.').pop();
                    return validTlds.has(tld);
                })
            .test('allowed-domains', `Email domain must be one of: ${allowedDomains?.join(", ")}`,
                value => {
                    if (!allowedDomains) return true;
                    const domain = value.split('@')[1];
                    return allowedDomains.includes(domain);
                }),
        creditCard: yup
            .string()
            .nullable()
            .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, 'Invalid creditCard format')
    });
};

const validateData = async (data, allowedDomains = null) => {
    try {
        const schema = createSchema(allowedDomains);
        const validatedData = await schema.validate(data);
        return { status: "success", data: validatedData };
    } catch (error) {
        return { status: "failed", message: error.message };
    }
};

module.exports = { validateData };