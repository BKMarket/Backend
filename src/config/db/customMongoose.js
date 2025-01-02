const mongoose = require('mongoose');
const { sortFields, pagination } = require('#utils/query.utils.js');

/**
 *Filter valid sort options from query
 * @param {Object} inputObj
 * @param {...string} fieldNamesArr
 * @returns
 */
mongoose.Query.prototype.sortFromFields = function (inputObj, fieldNamesArr) {
  const sortOptions = sortFields(inputObj, fieldNamesArr);
  return this.sort(sortOptions);
};

/**
 * Paginate query
 * @param {{page: Number, limit: Number}} inputObj
 */
mongoose.Query.prototype.paginate = function (inputObj) {
  const { skip, limit } = pagination(inputObj);
  return this.skip(skip).limit(limit);
};

module.exports = mongoose;
