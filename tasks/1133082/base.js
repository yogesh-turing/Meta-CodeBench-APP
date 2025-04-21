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
    if (allowedDomains && (!Array.isArray(allowedDomains) || !allowedDomains.every((domain) => typeof domain === "string") || allowedDomains.length === 0)) {
        return { status: "failed", message: "Invalid allowedDomains parameter" };
    }

    const creditCard = data.creditCard;
    if (typeof creditCard === "string") {
        if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(creditCard)) {
            return { status: "failed", message: "Invalid creditCard format" };
        }
    }

    const email = data.email;
    const errorMessage = validateEmail(email);
    if (errorMessage) return { status: "failed", message: errorMessage };



    if (allowedDomains?.length) {
        const domain = email.split("@")[1];
        if (!allowedDomains.includes(domain)) {
            return { status: "failed", message: `Email domain must be one of: ${allowedDomains.join(", ")}` };
        }
    }

    return { status: "success", data };
};

module.exports = { validateData };
