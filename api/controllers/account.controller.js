const Account = require("../models/account.model.js");
const Role = require("../models/role.model.js");
//[GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    // const records = await Account.find(find).select("-password -token");
    const records = await Account.find(find);

    for (const record of records) {
        const role = await Role.findOne({
            // _id: record.role_id,
            deleted: false
        });
        record.role_id = role.title;
    }
    // res.render("admin/pages/accounts/index", {
    //     pageTitle: "List of accounts",
    //     records: records,
    //   });

    res.json(records);
}
