const cart = require('../models/cart.modal');
const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');
const getHeaders = require('../utils/headers');

// Function to create a new student
const createStudent = async (req, res) => {
  try {
    const headers = getHeaders(req);
   
    // Read the Excel file from the request
    const file = req.file; // Assuming the file is uploaded as a multipart form-data
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the Excel file using XLSX and convert it to JSON
    const workbook = XLSX.readFile(file.path); // Read file from path or use file.buffer
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON format
    const studentsData = XLSX.utils.sheet_to_json(sheet);

    // Log the extracted data to ensure correctness
    console.log('Extracted Students Data:', studentsData);

 
    // Use a results array to capture success and failure messages
    const results = [];

    // Process students in batches to handle large Excel files
    const batchSize = 10; // Number of students to process in parallel (adjust as needed)

    for (let i = 0; i < studentsData.length; i += batchSize) {
      const batch = studentsData.slice(i, i + batchSize);

      // Process each student in the current batch
      const batchPromises = batch.map(async (student) => {
        // Ensure required fields are present
        if (!student.firstName || !student.gender || !student.dob || !student.email || !student.phone) {
          results.push({
            message: 'Missing required student fields',
            student,
          });
          return;
        }

        const data = {
          personalDetails: {
            namePrefix: student.namePrefix || "Mr",
            firstName: student.firstName,
            gender: student.gender,
            dob: student.dob,
            fatherName: student.fatherName || 'Unknown',
            guardianName: student.guardianName || 'Unknown'
          },
          contactDetails: {
            email: student.email,
            phone: student.phone,
            countryCode: (student.countryCode || "+91").toString()
          }
        };

        try {
          // Make API call to register the candidate
          const response = await axios.post(
            'https://backend.itrackglobal.com/api/user/v1/register/Candidate/v1',
            data,
            { headers, withCredentials: true }
          );

          // If the API call is successful, store the student data in the database
          const studentRecord = new cart({
            candidateId: response.data.candidateId, // Ensure candidateId is correctly assigned
            ...data,
            registrationResponse: response.data,
          });

          await studentRecord.save(); // Save the student data in the database

          results.push({ message: 'Student registered successfully', data: response.data, student });
        } catch (error) {
          console.error('Error in API call:', error);
          results.push({
            message: error.response?.data?.message || 'An error occurred during student registration',
            error: error.response?.data,
            student,
          });
        }
      });

      // Wait for the batch to complete before moving to the next batch
      await Promise.all(batchPromises);
    }

    // Send all results back in response
    res.json({ results });
  } catch (error) {
    console.error('Error in createStudent function:', error);
    res.status(500).json({ message: 'An internal server error occurred', error: error.message });
  } finally {
    // Optional: Clean up uploaded file after processing
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
  }
};


const getStudents = async (req, res) => {
  try {
    // Get pagination parameters from the request query, with defaults for page and limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query the database for all students with pagination
    const students = await cart.find().skip(skip).limit(limit);
    const totalStudents = await cart.countDocuments(); // Get the total count for pagination info

    // Calculate total pages
    const totalPages = Math.ceil(totalStudents / limit);

    res.json({
      students,
      pagination: {
        totalStudents,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    console.error('Error in getStudents function:', error);
    res.status(500).json({ message: 'An internal server error occurred', error: error.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
};

