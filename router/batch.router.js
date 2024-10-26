const { createBatch, getAllBatches, enrollCandidate, createAssesment, createCertificate, downloadCertificate } = require("../controller/batch.controller")
const express = require('express')
const batchRouter = express.Router();


batchRouter.post('/createBatch', createBatch);
batchRouter.get('/getBatch', getAllBatches)
batchRouter.post('/enroll', enrollCandidate)
batchRouter.post('/assesment', createAssesment)
batchRouter.post('/genrateCertificate', createCertificate)
batchRouter.post('/downloadCertificate', downloadCertificate)
module.exports = batchRouter