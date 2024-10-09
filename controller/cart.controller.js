const axios = require('axios');

// Variable to store the CSRF token and session cookie globally
let csrfToken = '';
let sessionCookies = '';

// Function to get the CSRF token and session cookies
const getCSRFToken = async () => {
  try {
    // Make a HEAD request to fetch the CSRF token and session cookies
    const response = await axios.head('https://adminservices.skillindiadigital.gov.in/api/user/v1', {
      withCredentials: true, // Include credentials to send/receive cookies
    });

    // Capture the CSRF token from response headers
    csrfToken = response.headers['x-csrf-token'];
    console.log('CSRF Token fetched:', csrfToken);

    // Capture session cookies from the response
    sessionCookies = response.headers['set-cookie'] ? response.headers['set-cookie'].join('; ') : '';
    console.log('Session Cookies:', sessionCookies);
  } catch (error) {
    console.error('Error fetching CSRF token:', error.message);
    throw new Error('Failed to retrieve CSRF token and session cookies');
  }
};

// Function to create a new student
const createStudent = async (req, res) => {
  try {
    // Ensure the CSRF token and session cookies are fetched before making the POST request
    await getCSRFToken();

    // Define the student registration data
    const data = { 
      "personalDetails": { 
        "namePrefix": "Mr", 
        "firstName": "ABC", 
        "gender": "Male", 
        "dob": "2005-03-01T00:00:00.000Z", 
        "fatherName": "PQRS", 
        "guardianName": "LSMN" 
      }, 
      "contactDetails": { 
        "email": "gan121j754@gmail.com", 
        "phone": 9662868385, 
        "countryCode": "+91" 
      } 
    };

    // Check if CSRF token and session cookies were successfully fetched
    if (!csrfToken || !sessionCookies) {
      return res.status(500).json({ message: 'Failed to retrieve CSRF token or session cookies' });
    }

    // Retrieve the Authorization token from environment variables
    const token = process.env.AUTH_TOKEN;

    // Check if the token is correctly provided
    if (!token) {
      return res.status(500).json({ message: 'Authorization token not provided' });
    }

    // Log the Authorization header to ensure correctness
    console.log('Authorization Header:', `Bearer ${token}`);

    // Define headers for the POST request
    const headers = {
      'X-Csrf-Token': csrfToken, // CSRF token retrieved earlier
      'Authorization': `${token}`, // Properly format the Authorization header with Bearer keyword
      'Content-Type': 'application/json',
      'Cookie': sessionCookies // Include session cookies captured during CSRF token fetch
    };

    // Make the POST request to register a new candidate
    const response = await axios.post(
      'https://adminservices.skillindiadigital.gov.in/api/user/v1/register/Candidate/v1', 
      JSON.stringify(data), 
      { headers, withCredentials: true } // Include credentials to send cookies with the request
    );

    // Send the successful response back to the client
    res.json({ message: response.data });
  } catch (error) {
    console.error('Error creating student:', error.message);

    // Handle errors gracefully, checking if the error response exists
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : 'Student creation failed. Please try again later.';

    // Send the error response back to the client
    res.status(statusCode).json({ message: errorMessage });
  }
};

module.exports = {
  createStudent
};
