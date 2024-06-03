const Product = require("../models/product.model.js");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Error while getting products: ', error);
        res.status(500).json({ error: 'Error while getting products' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category_id, img } = req.body;
        const newProduct = await Product.create({
            name,
            description,
            price,
            category_id,
            img
        });
        res.status(201).json({ message: "Thêm sản phẩm thành công !" });
    } catch (error) {
        console.error('Error while creating product:', error);
        res.status(500).json({ error: 'Error while creating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
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

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category_id, img } = req.body;
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
