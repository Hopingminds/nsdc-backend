const express=require('express')
const { createStudent } = require('../controller/cart.controller'); 
const authMiddleware =require('../middleware/auth.middleware')
const userCart=express.Router();

userCart.get('/createStudent',createStudent);


module.exports=userCart