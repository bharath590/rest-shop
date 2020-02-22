let { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product.find(req.params.productId)
        .select('name price _id')
        .then((results) => {
            console.log("data".results);
            if (results) {
                let Products = results.map((doc) => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET'
                        }
                    }
                })
                res.status(200).json({
                    messege: 'data found',
                    data: {
                        'length': results.length,
                        products: Products
                    }
                })
            } else {
                res.status(404).json({
                    messege: 'data not found',
                    data: {}
                })
            }
        })
        .catch((e) => {
            console.log("error", e);
            res.status(500).json({
                messege: 'error occured',
                data: e
            })
        })
}
exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price

    });
    product.save().then((results) => {
        console.log("results", results);
        res.status(200).json({
            messege: 'save success',
            data: {
                name: product.name,
                price: product.price,
                request: {
                    method: 'GET'
                }
            }
        })
    })
        .catch((err) => {
            console.log("err", err);
            res.status(500).json({
                messege: 'error occ while saving',
                data: err
            })
        });
}
exports.products_get_product = (req, res, next) => {
    Product.findById(req.params.productId)
        .select('name price _id')
        .then((results) => {
            console.log("data".results);
            if (results) {
                res.status(200).json({
                    messege: 'data found',
                    data: results
                })
            } else {
                res.status(404).json({
                    messege: 'data not found',
                    data: {}
                })
            }
        })
        .catch((e) => {
            console.log("error", e);
            res.status(500).json({
                messege: 'error occured',
                data: e
            })
        })
}
exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    let updateObj = {};
    let request = req.body;
    for (const key in request) {
        updateObj[key] = request[key];
    }
    Product.update({ _id: id }, { $set: updateObj })
        .exec()
        .then((results) => {
            res.status(200).json({
                data: {
                    messege: 'data updated'
                }
            })
        })
        .catch((e) => {

        })
}
exports.products_delete_product = (req, res, next) => {
    Product.remove({
        _id: req.params.productId
    })
        .exec()
        .then((results) => {
            res.status(200).json({
                data: {
                    messege: "item deleted",
                    data: {}
                }
            })
        })
        .catch((e) => {

        })
}