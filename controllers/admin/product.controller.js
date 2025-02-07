const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {

    let filterStatus = [
        {
            name: "Tất Cả",
            status: "",
            class: "",
            buttonColor: "primary"
        },
        {
            name: "Hoạt Động",
            status: "active",
            class: "",
            buttonColor: "success"
        },
        {
            name: "Dừng Hoạt Động",
            status: "inactive",
            class: "",
            buttonColor: "danger"
        }
    ];

    if (req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    let keyword = "";

    if (req.query.keyword) {
        keyword = req.query.keyword;

        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }

    const products = await Product.find(find);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh Sách Sản Phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    });
}