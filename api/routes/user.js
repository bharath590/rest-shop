const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
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
})
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email }).then((user) => {
        if (!user  || user.length < 1) {
            return res.status(201).json({
                msg: "auth failed"
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(result){
                console.log("@@@@@@@@@@@@@@",process.env.JWT_KEY);
                const token = jwt.sign({
                    email : user[0].email,
                    userId:user[0]._id
                },process.env.JWT_KEY,{
                    expiresIn:'1h'
                })
                return res.status(201).json({
                    msg: "auth success",
                    token : token
                })
            } else{
                return res.status(201).json({
                    msg: "auth failed"
                })
            }
        })
    })
    .catch((err)=>{
        res.status(400).json({
            msg:"auth failed"
        })
    })
})

module.exports = router;
