const Order = require('../models/order');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {

    Order.find()
        .select('quantity _id product')
        .populate('product', 'name')  //--> populate() cross different MongoDB collections. 1st arg: which property stores that crossed info; 2nd arg: what we want to take from that other collection  
        .then(orders => {

            res.status(200).json({
                count: orders.length,
                orders: orders.map(order => {
                    return {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/orders/${order._id}`
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


exports.orders_create_order = (req, res, next) => {
    const order = new Order({
        _id : mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });

    order.save()
        .then((order) => {
            console.log('POST /order', order);

            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity
                },
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/orders/${order._id}`
                }
            });

        }, (err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });

        });

    /*
        Product.findById(req.body.productId)
            .then(product => {
    
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }
    
                const order = new Order({
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
    
                return order.save()
    
            }).then((order) => {
                console.log('POST /order', order);
    
                res.status(201).json({
                    message: 'Order stored',
                    createdOrder: {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity
                    },
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/orders/${order._id}`
                    }
                });
    
            }, (err) => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
    
            });
    */
}


exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderID;
    Order.findById(id)
        .select('quantity _id product')
        .populate('product', '_id name price')  //--> populate() cross different MongoDB collections. 1st arg: which property stores that crossed info; 2nd arg: what we want to take from that other collection  
        .then(order => {

            if(!order){
                return res.status(404).json({
                    message: 'Order not found'
                });
            }

            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    info: 'GET_ALL_ORDERS',
                    url: 'http://localhost:3000/orders'
                }
            });

        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderID;

    Order.remove({ _id: id })
    .then(order => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        })

    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
}