const User = require('../models/user');
const bcrypt = require('bcrypt');           //--> it's insane to store plain pwds. We must protect them.
const jwt = require('jsonwebtoken');        //--> builds token for us. Login process
const mongoose = require('mongoose');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user && user.length >= 1) {
                return res.status(422).json({
                    msg: "email already exit"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            err: err
                        })
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save().then((result) => {
                            res.status(200).json({
                                msg: "creation success",
                            })
                        }).catch((err) => {
                            res.status(500).json({
                                msg: "creation failed",
                            })
                        })
                    }
                })
            }
        })
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email }).then((user) => {
        if (!user || user.length < 1) {
            return res.status(201).json({
                msg: "auth failed"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, {
                    expiresIn: '1h'
                })
                return res.status(201).json({
                    msg: "auth success",
                    token: token
                })
            } else {
                return res.status(201).json({
                    msg: "auth failed"
                })
            }
        })
    })
        .catch((err) => {
            res.status(400).json({
                msg: "auth failed"
            })
        })
}


exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .then(result => {
            res.status(200).json({
                message: 'User deleted with exit'
            });

        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}