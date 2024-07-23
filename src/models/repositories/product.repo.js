const { Types } = require("mongoose");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const result = await foundShop.save();
  return 1;
};
const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const result = await foundShop.save();
  return 1;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishForShop,
};
