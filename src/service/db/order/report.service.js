const Report = require('#models/report.model.js');
const mongoose = require('#config/db/customMongoose.js');

const createReport = async (account, productID, { orderID, reason }) => {
  const report = await Report.create({ account, product: productID, order: orderID, reason });
  return report;
};

const getReports = async (findOptions, sortOptions, { page = 1, limit = 10 } = {}) => {
  // const reports = await Report.find(findOptions)
  //   .sort(sortOptions)
  //   .paginate({ page, limit })
  //   .populate('account', '_id firstName lastName email avatar')
  //   .populate({
  //     path: 'product',
  //     populate: { path: 'createdBy', select: '_id firstName lastName email avatar' },
  //     select: '_id title thumbnail createdBy'
  //   })
  //   .populate('product.createdBy', '_id firstName lastName email avatar')
  //   .populate('order', '_id products');

  const reports = await Report.aggregate([
    // filter
    { $match: findOptions },
    // sort
    {
      $sort: sortOptions
    },
    // populate product createdBy
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'accounts',
              localField: 'createdBy',
              foreignField: '_id',
              pipeline: [
                { $project: { _id: 1, firstName: 1, lastName: 1, email: 1, avatar: 1, deleted: 1 } }
              ],
              as: 'createdBy'
            }
          },
          { $project: { _id: 1, title: 1, thumbnail: 1, createdBy: 1 } },
          { $unwind: '$createdBy' }
        ],
        as: 'product'
      }
    },
    {
      $unwind: '$product'
    },
    {
      $lookup: {
        from: 'reports',
        let: { createdById: '$product.createdBy._id' },
        pipeline: [
          {
            $lookup: {
              from: 'products',
              localField: 'product',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $unwind: '$product'
          },
          {
            $match: {
              $expr: { $eq: ['$product.createdBy', '$$createdById'] },
              verdict: 'guilty'
            }
          },
          {
            $count: 'guiltyReportsCount'
          }
        ],
        as: 'guiltyReportsCount'
      }
    },
    {
      $unwind: {
        path: '$guiltyReportsCount',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        guiltyReportsCount: { $ifNull: ['$guiltyReportsCount.guiltyReportsCount', 0] }
      }
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'account',
        foreignField: '_id',
        pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, email: 1, avatar: 1 } }],
        as: 'account'
      }
    },
    {
      $unwind: '$account'
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'order',
        foreignField: '_id',
        pipeline: [{ $project: { _id: 1, products: 1 } }],
        as: 'order'
      }
    },
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: limit
    }
  ]);

  return reports;
};

const setReportVerdict = async (reportID, verdict) => {
  const report = await Report.findByIdAndUpdate(reportID, { verdict }, { new: true });
  return report;
};

const reportService = {
  createReport,
  getReports,
  setReportVerdict
};

module.exports = reportService;
