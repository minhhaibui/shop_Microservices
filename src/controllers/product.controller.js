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
}
module.exports = new productController();
