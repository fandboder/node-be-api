const cron = require('node-cron');
const axios = require('axios');
const getAccessToken = require('../auth/auth');
const dotenv = require('dotenv');
const Category = require('../models/categoty.model');
const { sequelize } = require('../config/database');
dotenv.config();

const apiUrl = 'https://publicfnb.kiotapi.com/categories';

class SyncService {
    async syncCategories() {
        const accessToken = await getAccessToken();
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Retailer': process.env.RETAILER_ID
                }
            });

            const categoriesFromKiotViet = response.data.data;

            if (!Array.isArray(categoriesFromKiotViet)) {
                throw new Error('Categories is not an array');
            }

            const transaction = await sequelize.transaction();
            try {
                // Get all categories from local database
                const localCategories = await Category.findAll({ transaction });

                // Map local categories by categoryId for easier lookup
                const localCategoriesMap = new Map();
                localCategories.forEach(category => {
                    localCategoriesMap.set(category.categoryId.toString(), category);
                });

                // Track deleted categories
                const deletedCategoriesIds = new Set(localCategoriesMap.keys());

                // Process categories from KiotViet
                for (const kiotvietCategory of categoriesFromKiotViet) {
                    const { categoryId, categoryName, createdDate, modifiedDate } = kiotvietCategory;

                    // Check if the category exists locally
                    if (localCategoriesMap.has(categoryId.toString())) {
                        const category = localCategoriesMap.get(categoryId.toString());

                        // Update category if it exists
                        await category.update({
                            categoryName,
                            modifiedDate
                        }, { transaction });

                        // Remove updated category from deleted categories tracking
                        deletedCategoriesIds.delete(categoryId.toString());
                    } else {
                        // Create new category if it doesn't exist
                        await Category.create({
                            categoryId,
                            categoryName,
                            createdDate,
                            modifiedDate
                        }, { transaction });
                    }
                }

                // Delete categories that are no longer in KiotViet
                for (const categoryId of deletedCategoriesIds) {
                    const categoryToDelete = localCategoriesMap.get(categoryId);
                    await categoryToDelete.destroy({ transaction });
                }

                await transaction.commit();
                console.log('Categories synced successfully');
            } catch (error) {
                await transaction.rollback();
                console.error('Error during sync transaction:', error);
            }
        } catch (error) {
            console.error('Error fetching categories from KiotViet:', error.response?.data || error.message);
        }
    }

}

module.exports = new SyncService();
