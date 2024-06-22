const Product = require("../models/product.model.js");
const ProductImage = require('../models/productImage.model.js');
const { Op } = require("sequelize");

Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: ProductImage,
                attributes: ['url']
            }]
        });
        res.json(products);
    } catch (error) {
        console.error('Error while getting products: ', error);
        res.status(500).json({ error: 'Error while getting products' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category_id, images } = req.body;
        const newProduct = await Product.create({ name, description, price, category_id });
        if (images && images.length > 0) {
            const productImages = images.map(url => ({ product_id: newProduct.id, url }));
            await ProductImage.bulkCreate(productImages);
        }

        res.status(201).json(newProduct);

    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
        res.status(500).json({ error: 'Lỗi khi tạo sản phẩm' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await ProductImage.destroy({
            where: {
                product_id: productId
            }
        });
        const deletedRows = await Product.destroy({
            where: {
                id: productId
            }
        });
        if (deletedRows > 0) {
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
        const { name, description, price, category_id, images } = req.body;

        console.log('Received payload:', req.body);

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }

        await product.update({ name, description, price, category_id });

        await ProductImage.destroy({ where: { product_id: productId } });

        if (images && images.length > 0) {
            const productImages = images.map(url => ({ product_id: productId, url }));
            await ProductImage.bulkCreate(productImages);
        }

        res.json({ message: 'Sửa thông tin sản phẩm thành công' });
    } catch (error) {
        console.error('Error while updating product:', error);
        res.status(500).json({ error: 'Error while updating product' });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({
            where: { id: productId },
            include: [{
                model: ProductImage,
                attributes: ['url']
            }]
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error while getting product: ', error);
        res.status(500).json({ error: 'Error while getting product' });
    }
}


exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await Product.findAll({
            where:
            {
                category_id: categoryId
            },
            include: [{
                model: ProductImage,
                attributes: ['url']
            }]
        });
        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error while getting products by category: ', error);
        res.status(500).json({ error: 'Error while getting products by category' });
    }
};


exports.getProductByName = async (req, res) => {
    try {
        const name = req.params.name;
        const product = await Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            },
            include: [{
                model: ProductImage,
                attributes: ['url']
            }]
        });
        if (product.length > 0) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error while getting product by name: ', error);
        res.status(500).json({ error: 'Error while getting product by name' });
    }
};