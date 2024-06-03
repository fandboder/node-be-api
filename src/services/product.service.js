const Product = require("../models/product.model.js");

exports.getAllProducts = async () => {
    try {
        const products = await Product.findAll();
        return products;
    } catch (error) {
        console.error('Error while getting products: ', error);
        throw new Error('Error while getting products');
    }
};
