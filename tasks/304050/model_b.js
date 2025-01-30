const yup = require('yup');

const validTlds = new Set(["com", "org", "net", "edu", "gov"]);

const isValidEmailFormat = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const isValidDomain = (domain) => {
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) return false;
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
};

const validateEmail = (email) => {
    if (!isValidEmailFormat(email)) return "Invalid email format";
    if (email.includes("+")) return "Plus addressing is not allowed";
    if (email.includes("..")) return "Email cannot contain consecutive dots";
    if (email.length > 254) return "Email length must be less than 255 characters";
    const domain = email.split("@")[1];
    if (!isValidDomain(domain)) return "Invalid email domain format";
    const tld = domain.split(".").pop();
    if (!validTlds.has(tld)) return "Email must have a valid top-level domain";
    return null;
};

const validateData = (data, allowedDomains = null) => {
    // Validate allowedDomains parameter
    if (allowedDomains !== null) {
        const allowedDomainsSchema = yup.array().of(yup.string()).min(1).required();
        try {
            allowedDomainsSchema.validateSync(allowedDomains);
        } catch (error) {
            return { status: "failed", message: "Invalid allowedDomains parameter" };
        }
    }

    // Create dynamic schema based on allowedDomains
    const emailSchema = yup.string()
        .required()
        .test('custom-email-validation', 'Invalid email', function(value) {
            const error = validateEmail(value);
            if (error) {
                return this.createError({ message: error });
            }
            return true;
        })
        .test('allowed-domains', 'Invalid domain', function(value) {
            if (allowedDomains?.length) {
                const domain = value.split('@')[1];
                if (!allowedDomains.includes(domain)) {
                    return this.createError({
                        message: `Email domain must be one of: ${allowedDomains.join(", ")}`
                    });
                }
            }
            return true;
        });

    const schema = yup.object().shape({
        email: emailSchema,
        creditCard: yup.string()
            .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, 'Invalid creditCard format')
            .nullable()
    });

    try {
        const validatedData = schema.validateSync(data, { abortEarly: false });
        return { status: "success", data: validatedData };
    } catch (error) {
        return {
            status: "failed",
            message: error.errors[0] // Return first error message
        };
    }
};

module.exports = { validateData };