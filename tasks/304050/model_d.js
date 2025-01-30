const yup = require('yup');

const validTlds = new Set(["com", "org", "net", "edu", "gov"]);

const isValidEmailFormat = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const isValidDomain = (domain) => {
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) return false;
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
};

const customEmailValidator = (email) => {
    if (!isValidEmailFormat(email)) return false;
    if (email.includes("+")) return false;
    if (email.includes("..")) return false;
    if (email.length > 254) return false;
    const domain = email.split("@")[1];
    if (!isValidDomain(domain)) return false;
    const tld = domain.split(".").pop();
    if (!validTlds.has(tld)) return false;
    return true;
};

const validateData = async (data, allowedDomains = null) => {
    try {
        // Validate allowedDomains parameter if provided
        if (allowedDomains !== null) {
            await yup.array()
                .of(yup.string())
                .min(1)
                .required()
                .validate(allowedDomains)
                .catch(() => {
                    throw new Error("Invalid allowedDomains parameter");
                });
        }

        // Create dynamic schema based on allowedDomains
        const emailSchema = yup.string()
            .required()
            .test('custom-email', 'Invalid email format', customEmailValidator)
            .test('allowed-domain', `Email domain must be one of: ${allowedDomains?.join(", ")}`,
                function (email) {
                    if (!allowedDomains?.length) return true;
                    const domain = email.split("@")[1];
                    return allowedDomains.includes(domain);
                });

        const schema = yup.object().shape({
            email: emailSchema,
            creditCard: yup.string()
                .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, 'Invalid creditCard format')
                .optional(),
        });

        // Validate the data
        const validatedData = await schema.validate(data);
        return { status: "success", data: validatedData };

    } catch (error) {
        return { status: "failed", message: error.message };
    }
};

module.exports = { validateData };