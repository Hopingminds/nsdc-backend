const axios = require('axios');
const getHeaders = require('../utils/headers');
const apiClient = require('../config/axiosConfig.js')
const batch=require("../models/batch.modal.js")

// Function to create a batch
const createBatch = async (req, res) => {
    try {
        const headers = getHeaders(req);
        const { batchName, size, batchStartDate, batchEndDate, courseId, trainingHoursPerDay, batchStartTime, batchEndTime, totalFees, assessmentStartDate, assessmentEndDate, tcId, tpId } = req.body;
        const response = await apiClient.post(
            'api/batch/v1/create',
            {
                batchName,
                size,
                batchStartDate,
                batchEndDate,
                courseId,
                trainingHoursPerDay,
                batchStartTime,
                batchEndTime,
                batchFee: {
                    totalFees
                },
                feePaidBy: "Self-Paid",
                assessmentStartDate,
                assessmentEndDate,
                assessmentMode: "Self",
                batchType: "Regular",
                type: "Fee Based",
                skillingcategory: {
                    name: "NSDC Market led programme",
                    id: 1,
                    scheme: "Fee Based"
                },
                schemeId: "33293",
                schemeReferenceId: "Scheme_1159",
                schemeType: "feeBased",
                tpId,
                tcId,
                createdSource: "Created for NSDC Academy Partners"
            },
            { headers }
        );
        
        const newBatch = new Batch({
            batchId:response.data.batchId,
            batchName:response.data.batchName
        });

        await newBatch.save();

        res.status(200).json(response.data);
    } catch (error) {
        console.log("Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

module.exports = { createBatch };
