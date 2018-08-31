const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  // first check for missing data values
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // Validate the title value
  if (validator.isEmpty(data.title)) {
    errors.title = 'Job Title field is required';
  }

  // Validate the company value
  if (validator.isEmpty(data.company)) {
    errors.company = 'Company field is required';
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
