const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {

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
                    'length':results.length,
                    products:Products
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
})
router.get('/:productId', (req, res, next) => {
    //const product = new Product();
    Product.findById(req.params.productId).then((results) => {
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
})

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price

    });
    product.save().then((results) => {
        console.log("results", results);
        res.status(200).json({
            messege: 'save success',
            data: product
        })
    })
        .catch((err) => {
            console.log("err", err);
            res.status(500).json({
                messege: 'error occ while saving',
                data: err
            })
        });
})
router.delete('/:productId', (req, res, next) => {
    Product.remove({
        _id: req.params.productId
    })
        .exec()
        .then((results) => {
            res.status(200).json({
                data:results
            })
        })
        .catch((e) => {
            
        })
})

router.patch('/:productId', (req, res, next) => {
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
                data: results
            })
        })
        .catch((e) => {

        })
})


module.exports = router;

