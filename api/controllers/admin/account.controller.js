const Account = require("../../models/account.model.js");
const Role = require("../../models/role.model.js");
//[GET] /admin/api/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Account.find(find);

    for (const record of records) {
        const role = await Role.findOne({
            deleted: false
        });
        record.role_id = role.title;
    }

    res.json(records);
}
