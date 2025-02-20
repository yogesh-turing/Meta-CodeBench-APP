const Yup = require('yup');
const validator = require('validator');

function validateSignUpFormData(formData) {
    // Check if formData is null or undefined
    if (!formData) {
        return {
            validation: false,
            message: "Form data is required."
        };
    }

    // Required fields validation
    const requiredFields = ['firstname', 'lastname', 'email', 'password', 'confirm_password'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!formData[field] || formData[field].trim() === '') {
            return {
                validation: false,
                message: field + " is required."
            };
        }
    }

    // Address validation (if provided)
    if (formData.address) {
        const addressFields = ['house_no', 'street_address', 'city', 'state'];
        for (let i = 0; i < addressFields.length; i++) {
            const field = addressFields[i];
            if (!formData.address[field] || formData.address[field].trim() === '') {
                return {
                    validation: false,
                    message: field + " is required."
                };
            }
        }
    }

    // Email validation
    if (!validator.isEmail(formData.email)) {
        return {
            validation: false,
            message: "Email must be in the '@finsol.pk' domain."
        };
    }

    if (!formData.email.endsWith('@finsol.pk')) {
        return {
            validation: false,
            message: "Email must be in the '@finsol.pk' domain."
        };
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
        return {
            validation: false,
            message: "Password must be at least 8 characters long and contain at least one uppercase letter and one numeric digit."
        };
    }

    // Confirm password validation
    if (formData.password !== formData.confirm_password) {
        return {
            validation: false,
            message: "Password and Confirm Password should match."
        };
    }

    // State validation (if address is provided)
    if (formData.address) {
        const validStates = ['Punjab', 'Sindh', 'Balochistan', 'Kashmir', 'KPK'];
        if (!validStates.includes(formData.address.state)) {
            return {
                validation: false,
                message: "State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK."
            };
        }
    }

    // If all validations pass
    return {
        validation: true,
        message: null
    };
}

module.exports = { validateSignUpFormData };