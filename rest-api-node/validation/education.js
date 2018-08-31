const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateEducationInput(data) {
  let errors = {};

  // first check for missing data values
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // Validate the school value
  if (validator.isEmpty(data.school)) {
    errors.school = 'School field is required';
  }

  // Validate the degree value
  if (validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required';
  }

  // Validate the field of study value
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of Study field is required';
  }

  // Validate the from value
  if (validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
