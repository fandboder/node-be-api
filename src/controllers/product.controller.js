const Product = require("../models/product.model.js");
const ProductImage = require('../models/productImage.model.js');
const { Op } = require("sequelize");
const moment = require('moment-timezone');
const Category = require("../models/categoty.model.js");
const Menu = require("../models/menu.model.js");
const Attribute = require('../models/attribute.model.js');

Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });
Category.belongsTo(Menu, { foreignKey: 'menu_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });
Product.hasMany(Attribute, { foreignKey: 'product_id' });

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                attributes: ['id', 'categoryId', 'categoryName', 'created_at', 'updated_at', 'menu_id'],
                include: {
                    model: Menu,
                    attributes: ['id', 'name', 'created_at', 'updated_at']
                }
            }, {
                model: ProductImage,
                attributes: ['id', 'product_id', 'url', 'created_at', 'updated_at', 'position']
            }, {
                model: Attribute,
                attributes: ['id', 'product_id', 'attributeName', 'attributeValue']
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
        const { code, name, fullName, description, basePrice, category_id, images, attributes } = req.body;

        const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
        const currentTimeUTCF = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        const newProduct = await Product.create({ code, name, fullName, description, basePrice, category_id, created_at: currentTimeUTCF, updated_at: currentTimeUTCF });
        if (images && images.length > 0) {
            const productImages = images.map(image => ({ product_id: newProduct.id, url: image.url, position: image.position, created_at: currentTimeUTCF, updated_at: currentTimeUTCF }));
            await ProductImage.bulkCreate(productImages);
        }

        if (attributes && attributes.length > 0) {
            const productAttributes = attributes.map(attribute => ({
                product_id: newProduct.id,
                attributeName: attribute.attributeName,
                attributeValue: attribute.attributeValue
            }));
            await Attribute.bulkCreate(productAttributes);
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

        const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
        const currentTimeUTCF = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        await product.update({ name, description, price, category_id, updated_at: currentTimeUTCF });

        const currentImages = await ProductImage.findAll({ where: { product_id: productId } });

        if (images && images.length > 0) {
            for (let { url, position } of images) {
                const existingImage = currentImages.find(img => img.url === url);

                if (existingImage) {
                    if (existingImage.position !== position) {
                        const imageToSwap = currentImages.find(img => img.position === position);

                        if (imageToSwap) {
                            await imageToSwap.update({ position: existingImage.position, updated_at: currentTimeUTCF });
                        }

                        await existingImage.update({ position, updated_at: currentTimeUTCF });
                    } else {
                        await existingImage.update({ updated_at: currentTimeUTCF });
                    }
                } else {
                    await ProductImage.create({
                        product_id: productId,
                        url,
                        created_at: currentTimeUTCF,
                        updated_at: currentTimeUTCF,
                        position
                    });
                }
            }
        }

        const updatedProduct = await Product.findByPk(productId, {
            include: [{ model: ProductImage, as: 'ProductImages' }]
        });

        res.json({ updatedProduct });
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
                model: Category,
                attributes: ['id', 'categoryId', 'categoryName', 'created_at', 'updated_at', 'menu_id'],
                include: {
                    model: Menu,
                    attributes: ['id', 'name', 'created_at', 'updated_at']
                }
            }, {
                model: ProductImage,
                attributes: ['id', 'product_id', 'url', 'created_at', 'updated_at', 'position']
            }, {
                model: Attribute,
                attributes: ['id', 'product_id', 'attributeName', 'attributeValue']
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
                model: Category,
                attributes: ['id', 'categoryId', 'categoryName', 'created_at', 'updated_at', 'menu_id'],
                include: {
                    model: Menu,
                    attributes: ['id', 'name', 'created_at', 'updated_at']
                }
            }, {
                model: ProductImage,
                attributes: ['id', 'product_id', 'url', 'created_at', 'updated_at', 'position']
            }, {
                model: Attribute,
                attributes: ['id', 'product_id', 'attributeName', 'attributeValue']
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
                model: Category,
                attributes: ['id', 'categoryId', 'categoryName', 'created_at', 'updated_at', 'menu_id'],
                include: {
                    model: Menu,
                    attributes: ['id', 'name', 'created_at', 'updated_at']
                }
            }, {
                model: ProductImage,
                attributes: ['id', 'product_id', 'url', 'created_at', 'updated_at', 'position']
            }, {
                model: Attribute,
                attributes: ['id', 'product_id', 'attributeName', 'attributeValue']
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