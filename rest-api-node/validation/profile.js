const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  // first check for missing data values
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // Validate the handle value
  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle must be between 2 and 40 characters';
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = 'Handle field is required';
  }

  // Validate the status value
  if (validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }

  // Validate the skills value
  if (validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  // Validate the website value
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = 'Website must be a valid URL';
    }
  }

  // Validate the youtube value
  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = 'Youtube link must be a valid URL';
    }
  }

  // Validate the twitter value
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = 'Twitter link must be a valid URL';
    }
  }

  // Validate the facebook value
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = 'Facebook link must be a valid URL';
    }
  }

  // Validate the linkedin value
  if (!isEmpty(data.linkedIn)) {
    if (!validator.isURL(data.linkedIn)) {
      errors.linkedIn = 'LinkedIn link must be a valid URL';
    }
  }

  // Validate the instagram value
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = 'Instagram link must be a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
