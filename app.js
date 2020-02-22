const express = require('express');
const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./api/routes/user')

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Request-With,Content-Type,Accept,Authorization');
    if(res.method=='options'){
        res.header('Access-Control-Allow-Methods' ,'PUT,POST, GET, PATCH, DELETE');
        return res.status(200).json({

        })
    }
    next();
})
app.use('/products', productRoutes);
app.use('/order', orderRoutes);
app.use('/user',userRoutes);
mongoose.connect('mongodb://localhost/restshop');

mongoose.Promise = global.Promise;

app.use((req, res, next) => {
    let error = new Error('Not Found!')
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
       error : {
           error :error.message
       }
    })
})
module.exports = app;




