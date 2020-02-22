const express= require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/order')

router.get('/',checkAuth,orderController.orders_get_all);
router.post('/', checkAuth,orderController.orders_create_order);
router.get('/:orderID', checkAuth,orderController.orders_get_order)
module.exports= router;

