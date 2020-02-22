const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/products');

router.get('/',checkAuth, productController.products_get_all);
router.get('/:productId',checkAuth, productController.products_get_product);
router.post('/', checkAuth, productController.products_create_product);
router.delete('/:productId', productController.products_delete_product);
router.patch('/:productId', checkAuth,productController.products_get_product)


module.exports = router;

