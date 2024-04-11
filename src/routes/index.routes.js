const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const productRouter = require("./product");
const { apiKey, permission } = require("../auth/checkAuth");
//check apikey
router.use(apiKey);
router.use(permission("0000"));
// check permission

router.use("/v1/api", accessRouter);
router.use("/v1/api/product", productRouter);

module.exports = router;
