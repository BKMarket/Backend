const Role = require("../models/role.model");

//[GET] /admin/roles    --->Ghi chu cho controller
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.json(records);
}

