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
    var validStates = ['Punjab', 'Sindh', 'Balochistan', 'Kashmir', 'KPK'];

    // Define the schema for address
    var addressSchema = Yup.object().shape({
        house_no: Yup.string().required('house_no is required.'),
        street_address: Yup.string().required('street_address is required.'),
        city: Yup.string().required('city is required.'),
        state: Yup.string()
            .required('state is required.')
            .test('valid-state', 'State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK.', 
                function(value) {
                    return validStates.indexOf(value) !== -1;
                })
    });

    // Define the main schema
    var schema = Yup.object().shape({
        firstname: Yup.string().required('firstname is required.'),
        lastname: Yup.string().required('lastname is required.'),
        email: Yup.string()
            .required('email is required.')
            .test('valid-email', 'Email must be in the \'@finsol.pk\' domain.', 
                function(value) {
                    return validator.isEmail(value) && value.endsWith('@finsol.pk');
                }),
        password: Yup.string()
            .required('password is required.')
            .test('password-strength', 
                'Password must be at least 8 characters long and contain at least one uppercase letter and one numeric digit.',
                function(value) {
                    return value && 
                           value.length >= 8 && 
                           /[A-Z]/.test(value) && 
                           /[0-9]/.test(value);
                }),
        confirm_password: Yup.string()
            .required('confirm_password is required.'),
        address: Yup.object().nullable(true)
    });

    try {
        // Validate the basic schema
        schema.validateSync(formData, { abortEarly: true });

        // Check if passwords match
        if (formData.password !== formData.confirm_password) {
            return {
                validation: false,
                message: "Password and Confirm Password should match."
            };
        }

        // If address is provided, validate address schema
        if (formData.address) {
            addressSchema.validateSync(formData.address, { abortEarly: true });
        }

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