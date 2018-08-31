const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // first check for missing data values
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Validate the name value
  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  // Validate the email value
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is not a valid email format';
  }

  // Validate the password value
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters';
  }

  // Validate the password2 value
  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'Password field is required';
  }

  if (!validator.isLength(data.password2, { min: 6, max: 30 })) {
    errors.password2 = 'Password must be between 6 and 30 characters';
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = 'Both passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
