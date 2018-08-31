const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // first check for missing data values
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Validate the email value
  if (!validator.isEmail(data.email)) {
    errors.email = "Email is not a valid email format";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  // Validate the password value
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
