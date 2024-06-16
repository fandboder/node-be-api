const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

router.get('/getMenus', menuController.getMenus);

router.post('/addMenu', menuController.createMenu);

router.delete('/deleteMenu/:id', menuController.deleteMenu);

router.put('/updateMenu/:id', menuController.updateMenu);
module.exports = router;