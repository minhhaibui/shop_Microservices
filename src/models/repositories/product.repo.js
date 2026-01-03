const {Types} = require('mongoose');
const {product, electronic, clothing, furniture} = require('../../models/product.model');
const {getSelectData, getUnSelectData} = require('../../utils');

const findAllDraftsForShop = async ({query, limit, skip}) => {
  return await queryProduct({query, limit, skip});
};
const findAllPublishForShop = async ({query, limit, skip}) => {
  return await queryProduct({query, limit, skip});
};
const findAllProductsRepo = async ({limit, sort, page, filter, select}) => {
  const skip = (page - 1) * limit;
  console.log('getSelectData(select)', getSelectData(select));

  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
  const products = product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProductsRepo = async ({product_id, unSelect}) => {
  return product.findById(product_id).select(getUnSelectData(unSelect)).lean();
};

const searchProductByUser = async ({keySearch}) => {
  const result = await product
    .find(
      {
        isPublished: true,
        $text: {$search: keySearch},
      },
      {
        score: {$meta: 'textScore'},
        isDraft: 0,
        isPublished: 0,
      }
    )
    .sort({score: {$meta: 'textScore'}})
    .lean();

  return result;
};

const publishProductByShop = async ({product_shop, product_id}) => {
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
const unPublishProductByShop = async ({product_shop, product_id}) => {
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

const queryProduct = async ({query, limit, skip}) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
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
  searchProductByUser,
  findAllProductsRepo,
  findProductsRepo,
};
