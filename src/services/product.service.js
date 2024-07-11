const axios = require('axios');
const getAccessToken = require('../auth/auth');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
const { sequelize } = require('../config/database');
const Product = require('../models/product.model');
const ProductImage = require('../models/productImage.model');
const Attribute = require('../models/productAttribute.model');
const Category = require('../models/categoty.model');
dotenv.config();

const apiUrl = 'https://publicfnb.kiotapi.com/products';

class ProductService {
    async getProductsKiotviet() {
        const accessToken = await getAccessToken();
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Retailer': process.env.RETAILER_ID
            }
        });
        return response.data;
    };


    async getProducts() {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'categoryId', 'categoryName']
                    }, {
                        model: ProductImage,
                        attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                    }, {
                        model: Attribute,
                        attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                    }]
            });
            console.log()
            return products;
        } catch (error) {
            console.error('Error while getting products from database: ', error);
            throw new Error(`Error while getting products from database: ${error.message}`);
        }
    };


    async getProductById(id) {
        try {
            const product = await Product.findOne({
                where: { id },
                include: [{
                    model: Category,
                    attributes: ['id', 'categoryId', 'categoryName', 'createdDate', 'modifiedDate'],
                }, {
                    model: ProductImage,
                    attributes: ['id', 'productId', 'url', 'created_at', 'updated_at', 'position']
                }, {
                    model: Attribute,
                    attributes: ['id', 'productId', 'attributeName', 'attributeValue']
                }]
            });
            return product;
        } catch (error) {
            console.error('Error while getting product by id:', error);
            throw error;
        }
    };


    async createProductKiotviet(productData) {
        try {
            const accessToken = await getAccessToken();
            const response = await axios.post(apiUrl, productData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Retailer': process.env.RETAILER_ID,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error while creating product in KiotViet: ', error);
            throw new Error(`Error while creating product in KiotViet: ${error.message}`);
        }
    };


    async createProduct(productData) {
        try {

            const { id, code, name, fullName, description, basePrice, categoryId, images, attributes } = productData;


            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw new Error(`Category with id ${categoryId} does not exist.`);
            }

            const currentTimeVN = moment().tz('Asia/Ho_Chi_Minh');
            const currentTimeUTCF = currentTimeVN.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            const newProduct = await Product.create({
                id,
                code,
                name,
                fullName: fullName,
                description,
                basePrice,
                categoryId,
                createdDate: currentTimeUTCF,
                modifiedDate: currentTimeUTCF
            });

            if (images && images.length > 0) {
                for (let image of images) {
                    await ProductImage.create({
                        productId: newProduct.id,
                        url: image.url,
                        created_at: currentTimeUTCF,
                        updated_at: currentTimeUTCF,
                        position: image.position
                    });
                }
            }

            if (attributes && attributes.length > 0) {
                for (let attribute of attributes) {
                    if (!attribute.attributeName || !attribute.attributeValue) {
                        throw new Error('Attribute name and value cannot be null');
                    }
                    await Attribute.create({
                        productId: newProduct.id,
                        attributeName: attribute.attributeName,
                        attributeValue: attribute.attributeValue
                    });
                }
            }


            const kiotVietProductData = {
                name: newProduct.name,
                code: newProduct.code,
                categoryId: newProduct.categoryId,
                allowsSale: true,
                hasVariants: true,
                basePrice: newProduct.basePrice,
                images: images.map(image => image.url),
                attributes: attributes.map(attr => ({
                    attributeName: attr.attributeName,
                    attributeValue: attr.attributeValue
                }))
            };


            const kiotVietProduct = await this.createProductKiotviet(kiotVietProductData);
            // console.log(kiotVietProduct);
            return newProduct;
        } catch (error) {
            console.error('Error while creating product: ', error);
            throw new Error(`Error while creating product: ${error.message}`);
        }
    };


    async deleteProductKiotviet(productId) {
        const accessToken = await getAccessToken();
        try {
            const response = await axios.delete(`${apiUrl}/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Retailer': process.env.RETAILER_ID
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting product in KiotViet', error.response?.data || error.message);
            throw error;
        }
    };


    async deleteProduct(productId) {
        const transaction = await sequelize.transaction();
        try {
            //Xóa sản phẩm trên KiotViet
            await this.deleteProductKiotviet(productId);

            // Xóa các thuộc tính liên quan của sản phẩm trong cơ sở dữ liệu
            await Attribute.destroy({
                where: {
                    productId: productId
                },
                transaction
            });

            // Xóa các hình ảnh liên quan của sản phẩm trong cơ sở dữ liệu
            await ProductImage.destroy({
                where: {
                    productId: productId
                },
                transaction
            });

            // Xóa sản phẩm trong cơ sở dữ liệu
            const result = await Product.destroy({
                where: { id: productId },
                transaction
            });

            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            console.error('Error deleting product', error.response?.data || error.message);
            throw error;
        }
    };



}


module.exports = new ProductService();

