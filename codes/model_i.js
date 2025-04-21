const yup = require("yup");
const validTlds = new Set(["com", "org", "net", "edu", "gov"]);

// Define a custom validation function for email
const isValidEmail = (email) => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return false;
    if (email.includes("+")) return false;
    if (email.includes("..")) return false;
    if (email.length > 254) return false;
    const domain = email.split("@")[1];
    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) return false;
    const tld = domain.split(".").pop();
    if (!validTlds.has(tld)) return false;
    return true;
};

// Define a custom validation function for domain
const isValidDomain = (domain) => {
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) return false;
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
};

// Create a yup schema for the data object
const dataSchema = yup.object().shape({
    email: yup.string().required().test("email", "Invalid email", isValidEmail),
    creditCard: yup.string().required().matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/),
});

// Refactored validateData function using yup schema
const validateData = async (data, allowedDomains = null) => {
    try {
        // Validate the data object using the yup schema
        const validatedData = await dataSchema.validate(data, { abortEarly: false });

        // Additional validation for allowed domains
        if (allowedDomains?.length) {
            const domain = validatedData.email.split("@")[1];
            if (!allowedDomains.includes(domain)) {
                return { status: "failed", message: `Email domain must be one of: ${allowedDomains.join(", ")}` };
            }
        }

        return { status: "success", data: validatedData };
    } catch (error) {
        return { status: "failed", message: error.message };
    }
};

module.exports = { validateData };