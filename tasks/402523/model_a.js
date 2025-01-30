const yup = require('yup');

const validTlds = new Set(["com", "org", "net", "edu", "gov"]);

const isValidDomain = (domain) => {
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) return false;
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
};

const baseSchema = yup.object().shape({
    email: yup
        .string()
        .required()
        .max(254, "Email length must be less than 255 characters")
        .test('valid-format', 'Invalid email format', 
            value => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
        .test('no-plus-addressing', 'Plus addressing is not allowed',
            value => !value.includes('+'))
        .test('no-consecutive-dots', 'Email cannot contain consecutive dots',
            value => !value.includes('..'))
        .test('valid-domain', 'Invalid email domain format',
            value => {
                const domain = value.split('@')[1];
                return isValidDomain(domain);
            })
        .test('valid-tld', 'Email must have a valid top-level domain',
            value => {
                const tld = value.split('@')[1].split('.').pop();
                return validTlds.has(tld);
            }),
    creditCard: yup
        .string()
        .nullable()
        .test('valid-format', 'Invalid creditCard format',
            value => !value || /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(value))
});

const validateData = async (data, allowedDomains = null) => {
    try {
        // Validate allowedDomains parameter
        if (allowedDomains) {
            if (!Array.isArray(allowedDomains) || 
                !allowedDomains.every(domain => typeof domain === 'string') || 
                allowedDomains.length === 0) {
                return { 
                    status: 'failed', 
                    message: 'Invalid allowedDomains parameter' 
                };
            }
        }

        // Create schema based on allowedDomains
        let schema = baseSchema;
        if (allowedDomains?.length) {
            schema = schema.shape({
                email: baseSchema.fields.email.test(
                    'allowed-domain',
                    `Email domain must be one of: ${allowedDomains.join(', ')}`,
                    value => {
                        const domain = value.split('@')[1];
                        return allowedDomains.includes(domain);
                    }
                )
            });
        }

        // Validate data against schema
        const validatedData = await schema.validate(data);
        return { status: 'success', data: validatedData };
    } catch (error) {
        return { status: 'failed', message: error.message };
    }
};

module.exports = { validateData };