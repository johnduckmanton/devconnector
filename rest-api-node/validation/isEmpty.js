/*
 * Function to test any type of object to determine
 * if it is empty. 
 * Could have used the function from _lodash but wanted
 * to minimise the number of libraries used
 */
const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value == "object" && Object.keys(value).length === 0) ||
  (typeof value == "string" && value.trim().length === 0);

module.exports = isEmpty;
