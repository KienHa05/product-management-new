const ProductCategory = require("../../models/product-category.model");

const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {

  const find = {
    status: "active",
    deleted: false
  };

  const sort = {
    position: "desc"
  };

  const productsCategory = await ProductCategory.find(find).sort(sort);

  const newProductsCategory = createTreeHelper.tree(productsCategory);

  res.locals.layoutProductsCategory = newProductsCategory;

  next();
}