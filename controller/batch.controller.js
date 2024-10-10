const axios = require('axios');
const getHeaders = require('../utils/headers');
const apiClient = require('../config/axiosConfig.js')

// Function to create a batch
const createBatch = async (req, res) => {
    try {
        // Use the getHeaders utility to get headers from the request
        const headers = getHeaders(req);
        console.log("Headers:", headers);  // Log the headers to verify

        const response = await apiClient.post(
            '/api/batch/v1/create',
            {
                batchName: "Testing Batch",
                size: 1,
                batchStartDate: "2024-09-10T00:00:00Z",
                batchEndDate: "2024-11-10T00:00:00Z",
                courseId: "FeeSchCor_50620",
                trainingHoursPerDay: 1,
                batchStartTime: "2024-09-10T02:30:00Z",
                batchEndTime: "2024-11-10T03:30:00Z",
                batchFee: {
                    totalFees: 1000
                },
                feePaidBy: "Self-Paid",
                assessmentStartDate: "2024-11-10T00:00:00Z",
                assessmentEndDate: "2024-11-10T00:00:00Z",
                assessmentMode: "Self",
                batchType: "Regular",
                type: "Fee Based",
                skillingcategory: {
                    name: "NSDC Market led programme",
                    id: 1,
                    scheme: "Fee Based"
                },
                schemeId: "44589",
                schemeReferenceId: "123456TESTING",
                schemeType: "feeBased",
                tpId: "TP200988",
                tcId: "TC357445",
                createdSource: "Created for NSDC Academy Partners"
            },
            { headers }
        );

        // Send back the response from the API
        res.status(200).json(response.data);
    } catch (error) {
        // Handle errors and send a proper response
        console.log("Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

module.exports = { createBatch };
