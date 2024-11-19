module.exports.sortFields = (query, ...fields) => {
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

module.exports.findFields = (query, ...fields) => {
  const findOptions = {};
  fields.forEach((field) => {
    if (query[field]) findOptions[field] = query[field];
  });
  // Default find option, everything
  return findOptions;
};

module.exports.pickFields = (query, ...fields) => {
  const pickOptions = {};
  fields.forEach((field) => {
    if (query[field]) pickOptions[field] = query[field];
  });
  return pickOptions;
};

// Offset pagination
module.exports.pagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip
  };
};
