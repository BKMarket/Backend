const express = require('express');

const router = express.Router();

const controller = require('../../controllers/admin/product.controller.js');

router.get('/', controller.index);

router.get("/detail/:id", controller.detail);

router.get("/create", controller.create);

router.post("/create", controller.createPost);


router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editPatch);

router.delete("/delete/:id", controller.delete);


module.exports = router;