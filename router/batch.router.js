const {createBatch}=require("../controller/batch.controller")
const express=require('express')
const batchRouter=express.Router();


batchRouter.get('/createBatch',createBatch);

module.exports=batchRouter