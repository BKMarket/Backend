const reportService = require('#service/db/order/report.service.js');

module.exports.getReports = (verdict) => async (req, res) => {
  const reports = await reportService.getReports(
    { ...(verdict && { verdict }) },
    { createdAt: 1 },
    req.query
  );
  res.json({ success: true, data: reports });
};

module.exports.guilty = async (req, res, next) => {
  try {
    const report = await reportService.setReportVerdict(req.params.id, 'guilty');
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

module.exports.innocent = async (req, res, next) => {
  try {
    const report = await reportService.setReportVerdict(req.params.id, 'innocent');
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};
