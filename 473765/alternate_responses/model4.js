const Yup = require('yup');
const validator = require('validator');

function validateSignUpFormData(formData) {
    // Define valid states
    const validStates = ['Punjab', 'Sindh', 'Balochistan', 'Kashmir', 'KPK'];

    // Address schema
    const addressSchema = Yup.object().shape({
        house_no: Yup.string().required('house_no is required.'),
        street_address: Yup.string().required('street_address is required.'),
        city: Yup.string().required('city is required.'),
        state: Yup.string()
            .required('state is required.')
            .test('valid-state', 'State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK.', 
                function(value) {
                    return validStates.includes(value);
                }
            )
    });

    // Main schema
    const schema = Yup.object().shape({
        firstname: Yup.string().required('firstname is required.'),
        lastname: Yup.string().required('lastname is required.'),
        email: Yup.string()
            .required('email is required.')
            .test('valid-email-domain', 'Email must be in the \'@finsol.pk\' domain.',
                function(value) {
                    return value && 
                           validator.isEmail(value) && 
                           value.endsWith('@finsol.pk');
                }
            ),
        password: Yup.string()
            .required('password is required.')
            .test('password-strength', 
                'Password must be at least 8 characters long and contain at least one uppercase letter and one numeric digit.',
                function(value) {
                    return value && 
                           value.length >= 8 && 
                           /[A-Z]/.test(value) && 
                           /[0-9]/.test(value);
                }
            ),
        confirm_password: Yup.string()
            .required('confirm_password is required.')
            .test('passwords-match', 'Password and Confirm Password should match.',
                function(value) {
                    return value === this.parent.password;
                }
            ),
        address: Yup.object().nullable(true)
            .test('address-validation', function(value, context) {
                if (!value) {
                    return true;
                }
                
                try {
                    addressSchema.validateSync(value, { abortEarly: true });
                    return true;
                } catch (error) {
                    return this.createError({
                        message: error.message
                    });
                }
            })
    });

    try {
        schema.validateSync(formData, { abortEarly: true });
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