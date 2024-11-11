const Role = require("../../models/role.model");

//[GET] /admin/api/roles    
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.json(records);
}

module.exports.create = async(req, res) => {
    res.send("Create role");
}

module.exports.createPost = async(req, res) => {
    const record = new Role(req.body);
    await record.save();
    res.json("Create role successfully");
}

module.exports.edit = async(req, res) => {
    const id = req.params.id;
    const data = await Role.findOne({
        _id: id,
        deleted: false
    });
    res.json(data);
}

module.exports.editPatch = async(req, res) => {
    await Role.updateOne({
        _id: req.params.id
    }, req.body);
    res.send("Update role successfully");
}

module.exports.permissions = async(req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.json(records);
}

module.exports.permissionsPatch = async(req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions){
        await Role.updateOne({
            _id: item.id
        }, {
            permissions: item.permissions
        });
    }
    res.send("Update permissions successfully");
}

module.exports.detail = async(req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    }
    const role = await Role.findOne(find);
    res.json(role);
}