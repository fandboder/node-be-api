const axios = require('axios');
const getAccessToken = require('../auth/auth');
const dotenv = require('dotenv');
dotenv.config();

const apiUrl = 'https://publicfnb.kiotapi.com/products';

class ProductService {
    async getProductsKyotviet() {
        const accessToken = await getAccessToken();
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Retailer': process.env.RETAILER_ID
            }
        });
        return response.data;
    }
}

module.exports = new ProductService();

