/**
 * Extract sorting value for fields from query, precedence is given to the first valid field in the fields list
 * @param {Object} query
 * @param {...string} fields
 */
const sortFields = (query, ...fields) => {
  const sortOptions = {
    _id: 'desc'
  };

  // Take the first valid field in the fields list (Only 1 sort option per query)
  for (const field of fields) {
    if (query[`${field}Sort`] === 'asc' || query[`${field}Sort`] === 'desc') {
      sortOptions[field] = query[`${field}Sort`];
      delete sortOptions._id;
      return sortOptions;
    }
  }
  // Default sort option is sort by _id
  return {
    _id: 'desc'
  };
};

/**
 * Match fields from query, remove undefined fields
 * @param {Object} query
 * @param {...string} fields
 */
const findFields = (query, ...fields) => {
  const findOptions = {};
  fields.forEach((field) => {
    if (query[field]) findOptions[field] = query[field];
  });
  // Default find option, everything
  return findOptions;
};

/**
 * Pick only ALLOWED fields from query
 * @param {Object} query
 * @param {...string} fields
 */
const pickFields = (query, ...fields) => {
  const pickOptions = {};
  fields.forEach((field) => {
    if (query[field]) pickOptions[field] = query[field];
  });
  return pickOptions;
};

/**
 * Returns pagination value
 * @param {{page: Number, limit: Number}} query
 */
const pagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip
  };
};

const queryUtils = {
  sortFields,
  findFields,
  pickFields,
  pagination
};

module.exports = queryUtils;
