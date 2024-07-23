const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { badRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
} = require("../models/repositories/product.repo");

//define Factory class to create product

class ProductFactory {
  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new badRequestError(`Invalid product types ${type}`);
    return new productClass(payload).createProduct();
  }
  //put
  static async publishProductByShop({ product_shop, product_id }) {
    return publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return unPublishProductByShop({ product_shop, product_id });
  }

  //end put

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
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
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new badRequestError("create new furniture error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new badRequestError("create new product error");
    return newProduct;
  }
}

//register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

//export
module.exports = ProductFactory;
