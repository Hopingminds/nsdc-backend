const express=require('express')
const { getCSRFToken, getSecretKey , getLogin } = require('../controller/user.controller'); 
const userRouter=express.Router();

userRouter.get('/getCrfToken',getCSRFToken);
userRouter.get('/getKey',getSecretKey);
userRouter.get('/login',getLogin);

module.exports=userRouter