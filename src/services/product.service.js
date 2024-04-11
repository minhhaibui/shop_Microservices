const { product, clothing, electronic } = require("../models/product.model");
const { badRequestError } = require("../core/error.response");
const { productRegistry } = require("./product.service.junior");

//define Factory class to create product

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronics":
        return new Elictronic(payload).createProduct();
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new badRequestError(`Invalid product types ${type}`);
    }
  }
}

//define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  //create new product
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

//define sub-class for defferent product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new badRequestError("create new clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new badRequestError("create new product error");
    return newProduct;
  }
}

//define sub-class for defferent product types elictronic
class Elictronic extends Product {
  async createProduct() {
    const newElictronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElictronic)
      throw new badRequestError("create new electronic error");
    const newProduct = await super.createProduct(newElictronic._id);
    if (!newProduct) throw new badRequestError("create new product error");
    return newProduct;
  }
}

module.exports = ProductFactory;
