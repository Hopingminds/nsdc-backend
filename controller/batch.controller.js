const axios = require('axios');
const getHeaders = require('../utils/headers');
const apiClient = require('../config/axiosConfig.js')
const Batch = require("../models/batch.modal.js")

// Function to create a batch
const createBatch = async (req, res) => {
    try {
        const headers = getHeaders(req);
        const { batchName, size, batchStartDate, batchEndDate, courseId, trainingHoursPerDay, batchStartTime, batchEndTime, totalFees, assessmentStartDate, assessmentEndDate, tcId, tpId } = req.body;
        const response = await apiClient.post(
            'api/batch/v1/create',
            {
                batchName,
                size: Number(size), // Ensure size is an integer
                batchStartDate,
                batchEndDate,
                courseId,
                trainingHoursPerDay:parseFloat(trainingHoursPerDay),
                batchStartTime,
                batchEndTime,
                batchFee: {
                    totalFees:parseInt(totalFees, 10)
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
            batchId: response.data.batchId,
            batchName: response.data.batchName
        });

        await newBatch.save();

        res.status(200).json(response.data);
    } catch (error) {
        console.log("Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

const getBatch = async (req, res) => {
    try {
        const { batchId } = req.params;  // Get batchId from request parameters

        // Find the batch in the database by batchId
        const batch = await Batch.findOne({ batchId });

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // If batch is found, return the batch details
        res.status(200).json(batch);
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const enrollCandidate = async (req, res) => {
    try {
        const headers = getHeaders(req);
        const { batchId, candidateIds } = req.body;

        // Validate required parameters
        if (!batchId || !Array.isArray(candidateIds) || candidateIds.length === 0) {
            return res.status(400).json({ error: "Invalid request payload. 'batchId' and 'candidateIds' are required." });
        }

        // Log the payload for debugging
        console.log("Request Payload:", { batchId, candidateIds });

        const response = await apiClient.post(
            '/api/thirdparty/v1/enroll/Candidate',
            { batchId, candidateIds },  // Dynamic data from the request body
            { headers }
        );

        console.log("API Response Data:", response.data);
        res.status(200).json(response.data);

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

const createAssesment = async (req, res) => {
    try {
        const headers = getHeaders(req);
        const { batchId, candidates } = req.body;

        // Validate required parameters
        if (!batchId || !Array.isArray(candidates) || candidates.length === 0) {
            return res.status(400).json({ error: "Invalid request payload. 'batchId' and 'candidates' are required." });
        }

        // Format payload according to new structure
        const payload = {
            batchId,
            candidates: candidates.map(candidate => ({
                candidateID: candidate.candidateID,
                trainingDetails: {
                    trainingStatus: candidate.trainingDetails?.trainingStatus,
                    attendance: candidate.trainingDetails?.attendance
                },
                assessmentDetails: {
                    assessmentStatus: candidate.assessmentDetails?.assessmentStatus,
                    assessmentPercentage: candidate.assessmentDetails?.assessmentPercentage,
                    grade: candidate.assessmentDetails?.grade,
                    assessmentDataUploadedOn: candidate.assessmentDetails?.assessmentDataUploadedOn,
                    assessmentAgency: candidate.assessmentDetails?.assessmentAgency,
                    assessorID: candidate.assessmentDetails?.assessorID,
                    assessorName: candidate.assessmentDetails?.assessorName
                },
                certificationDetails: {
                    certificationName: candidate.certificationDetails?.certificationName,
                    isCertified: candidate.certificationDetails?.isCertified,
                    certifyingAgency: candidate.certificationDetails?.certifyingAgency,
                    certificationDate: candidate.certificationDetails?.certificationDate
                }
            }))
        };

        // Log the formatted payload for debugging
        console.log("Formatted Request Payload:", payload);

        // Send formatted payload to the API endpoint
        const response = await apiClient.post(
            '/v1/candidates/candidate/pushBatchEachCandidate',
            req.body,
            { headers }
        );

        console.log("API Response Data:", response.data);
        res.status(200).json(response.data);

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// Function to get all batches from the database
const getAllBatches = async (req, res) => {
    try {
        // Get the page and limit from query parameters or set defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch batches with pagination
        const batches = await Batch.find().skip(skip).limit(limit);

        // Get the total count of documents for pagination details
        const totalBatches = await Batch.countDocuments();

        // If no batches found, return a 404 status
        if (batches.length === 0) {
            return res.status(404).json({ message: 'No batches found' });
        }

        // Return paginated batch details
        res.status(200).json({
            totalBatches,
            page,
            totalPages: Math.ceil(totalBatches / limit),
            batches
        });
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};


const createCertificate = async (req, res) => {
    try {
        const headers = getHeaders(req);
        const { userName, batchId } = req.body;

        // Validate required parameters
        if (!userName || !batchId) {
            return res.status(400).json({ error: "Invalid request payload. 'userName' and 'batchId' are required." });
        }

        // Log the payload for debugging
        console.log("Request Payload:", { userName, batchId });

        const response = await apiClient.post(
            '/api/v1/cert/certificate?for=trainingPartner',
            { userName, batchId },  // Payload with userName and batchId
            { headers }
        );

        console.log("API Response Data:", response.data);
        res.status(200).json(response.data);

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

const downloadCertificate = async (req, res) => {
    try {
        const headers = getHeaders(req);
        const { batchId, candidateId } = req.body;


        // Validate required parameters
        if (!batchId || !candidateId) {
            return res.status(400).json({ error: "Invalid request payload. 'batchId' and 'candidateId' are required." });
        }

        const response = await apiClient.get(
            `api/v1/cert/uc/singledocdownload?batchId=${batchId}&candidateId=${candidateId}&type=externalcertificate`,
            {
                headers
            }
        );  // Convert response data to a Blob
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'certificate.pdf'; // Specify the download filename
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the Blob URL and removing the link
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        console.log("API Response Data:", response.data);
        res.status(200).json(response.data);

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

const deleteBatch = async (req, res) => {
    try {
        const { _id } = req.body; // Get batchId from request parameters

        const deletedBatch = await Batch.findOneAndDelete({ _id: _id });

        // If no batch is found, return a 404 error
        if (!deletedBatch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Return a success message if batch is deleted
        res.status(200).json({ message: 'Batch deleted successfully' });
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};



module.exports = { createBatch, getAllBatches, enrollCandidate, createAssesment, createCertificate, downloadCertificate , deleteBatch };
