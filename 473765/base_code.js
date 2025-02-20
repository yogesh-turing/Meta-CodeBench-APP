function validateSignUpFormData(formData) {
  if (formData != null) {
    return true;
  }

  return false;
}

module.exports = { validateSignUpFormData };