const Yup = require('yup');
const validator = require('validator');

function validateSignUpFormData(formData) {
    // Return early if formData is null or undefined
    if (!formData) {
        return {
            validation: false,
            message: "Form data is required."
        };
    }

    // Define valid states
    const validStates = ['Punjab', 'Sindh', 'Balochistan', 'Kashmir', 'KPK'];

    // Basic schema for required fields
    const schema = Yup.object().shape({
        firstname: Yup.string().required('firstname is required.'),
        lastname: Yup.string().required('lastname is required.'),
        email: Yup.string().required('email is required.'),
        password: Yup.string().required('password is required.'),
        confirm_password: Yup.string().required('confirm_password is required.'),
        address: Yup.object().shape({
            house_no: Yup.string().when('$hasAddress', {
                is: true,
                then: Yup.string().required('house_no is required.')
            }),
            street_address: Yup.string().when('$hasAddress', {
                is: true,
                then: Yup.string().required('street_address is required.')
            }),
            city: Yup.string().when('$hasAddress', {
                is: true,
                then: Yup.string().required('city is required.')
            }),
            state: Yup.string().when('$hasAddress', {
                is: true,
                then: Yup.string().required('state is required.')
            })
        }).nullable()
    });

    try {
        // Check if address is provided
        const hasAddress = formData.address != null;
        
        // Sync validation of schema
        schema.validateSync(formData, {
            abortEarly: true,
            context: { hasAddress: hasAddress }
        });

        // Email domain validation
        if (!formData.email.endsWith('@finsol.pk')) {
            return {
                validation: false,
                message: "Email must be in the '@finsol.pk' domain."
            };
        }

        // Password complexity validation
        if (formData.password.length < 8 || 
            !/[A-Z]/.test(formData.password) || 
            !/[0-9]/.test(formData.password)) {
            return {
                validation: false,
                message: "Password must be at least 8 characters long and contain at least one uppercase letter and one numeric digit."
            };
        }

        // Password match validation
        if (formData.password !== formData.confirm_password) {
            return {
                validation: false,
                message: "Password and Confirm Password should match."
            };
        }

        // State validation (only if address is provided)
        if (hasAddress && !validStates.includes(formData.address.state)) {
            return {
                validation: false,
                message: "State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK."
            };
        }

        // If all validations pass
        return {
            validation: true,
            message: null
        };

    } catch (error) {
        return {
            validation: false,
            message: error.message
        };
    }
}

module.exports = { validateSignUpFormData };