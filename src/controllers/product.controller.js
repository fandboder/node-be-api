const Product = require("../models/product.model.js");

// Retrieve all Products from the database.
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Error while getting products: ', error);
        res.status(500).json({ error: 'Error while getting products' });
    }
};

// Thêm sản phẩm mới vào cơ sở dữ liệu
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category_id, img } = req.body;

        // Tạo một sản phẩm mới
        const newProduct = await Product.create({
            name,
            description,
            price,
            category_id,
            img
        });

        res.status(201).json({ message: "Thêm sản phẩm thành công !" }); // Trả về sản phẩm mới đã được tạo
    } catch (error) {
        console.error('Error while creating product:', error);
        res.status(500).json({ error: 'Error while creating product' });
    }
}
