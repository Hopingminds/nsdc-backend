const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');

// Function to create a new student
const createStudent = async (req, res) => {
  try {
    const csrfToken = req.headers['x-csrf-token'] || req.headers['csrfToken'];
    const sessionCookies = req.headers['set-cookie'] || req.headers['sessionCookies'];
    const token = req.headers['authorization'] || req.headers['Authorization'] || req.headers['token'];

    if (!csrfToken || !sessionCookies || !token) {
      return res.status(400).json({ message: 'Required headers are missing' });
    }

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

    // Define headers for the API requests
    const headers = {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
      'Authorization': token,
      'Cookie': sessionCookies
    };

    // Use a results array to capture success and failure messages
    const results = [];

    // Process students in batches to handle large Excel files
    const batchSize = 10; // Number of students to process in parallel (adjust as needed)

    for (let i = 0; i < studentsData.length; i += batchSize) {
      const batch = studentsData.slice(i, i + batchSize);

      // Process each student in the current batch
      const batchPromises = batch.map(async (student) => {
        const data = {
          personalDetails: {
            namePrefix: student.namePrefix || "Mr",
            firstName: student.firstName,
            gender: student.gender,
            dob: student.dob,
            fatherName: student.fatherName,
            guardianName: student.guardianName
          },
          contactDetails: {
            email: student.email,
            phone: student.phone,
            countryCode: (student.countryCode || "+91").toString()
          }
        };

        try {
          const response = await axios.post(
            'https://backend.itrackglobal.com/api/user/v1/register/Candidate/v1',
            data,
            { headers, withCredentials: true }
          );
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

module.exports = {
  createStudent,
};
