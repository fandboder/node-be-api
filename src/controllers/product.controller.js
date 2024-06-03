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
};

// Xóa sản phẩm từ cơ sở dữ liệu
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        // Tìm và xóa sản phẩm từ cơ sở dữ liệu
        const deletedProduct = await Product.destroy({
            where: {
                product_id: productId
            }
        });

        if (deletedProduct) {
            res.json({ message: 'Xóa sản phẩm thành công' });
        } else {
            res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
    } catch (error) {
        console.error('Error while deleting product:', error);
        res.status(500).json({ error: 'Error while deleting product' });
    }
};

// Sửa thông tin của sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category_id, img } = req.body;

        // Tìm sản phẩm trong cơ sở dữ liệu và cập nhật thông tin
        const [updated] = await Product.update(
            { name, description, price, category_id, img },
            { where: { product_id: productId } }
        );

        if (updated) {
            res.json({ message: 'Sửa thông tin sản phẩm thành công' });
        } else {
            res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
    } catch (error) {
        console.error('Error while updating product:', error);
        res.status(500).json({ error: 'Error while updating product' });
    }
};
