const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validatePostCommentInput(data) {
  let errors = {};

  // first check for missing data values
  data.text = !isEmpty(data.text) ? data.text : '';

  // Validate the text value
  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.handle = 'Entry must be between 30 and 300 characters';
  }

  if (validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
