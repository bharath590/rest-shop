const express= require('express');
const router = express.Router();
router.get('/',(req,res,next)=>{
    res.status(200).json({
        messesge:'order fetched'
    })
})
router.get('/:orderID',(req,res,next)=>{
    res.status(200).json({
        messesge:'order fetched',
        orderId:req.params.orderID
    })
})
router.post('/',(req,res,next)=>{
    const order = {
        productId : req.body.productId,
        quantity : req.body.quantity
    }
    res.status(201).json({
        messesge:'order was created',
        data:order
    })
})
module.exports= router;

