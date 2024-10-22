const Role = require("../../models/role.model");

//[GET] /admin/api/roles    
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.json(records);
}

