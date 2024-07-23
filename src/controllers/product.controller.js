const { negate } = require("lodash");
const {
  createReponse,
  Ok,
  successReponse,
} = require("../core/success.response");
const productService = require("../services/product.service");
const productServiceV2 = require("../services/product.service.junior");

class productController {
  createProduct = async (req, res, next) => {
    // new createReponse({
    //   message: "create new product success!",
    //   metadata: await productService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);
    new createReponse({
      message: "create new product success!",
      metadata: await productServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new createReponse({
      message: "publishProductByShop success!",
      metadata: await productServiceV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new createReponse({
      message: "publishProductByShop success!",
      metadata: await productServiceV2.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res, next) => {
    new successReponse({
      message: "get list draft success!",
      metadata: await productServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishForShop = async (req, res, next) => {
    new successReponse({
      message: "get list publish success!",
      metadata: await productServiceV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}
module.exports = new productController();
