const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");


module.exports = (app) => {
    app.use(categoryMiddleware.category); // Tối ưu dạng middleware bên Client khi mở rộng
    app.use(cartMiddleware.cartId);

    app.use("/", homeRoutes);

    app.use("/products", productRoutes);

    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);
}