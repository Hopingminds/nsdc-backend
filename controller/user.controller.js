// controllers/userController.js
const user = require('../models/user.modal'); // Adjust the path as needed
const jwt = require('jsonwebtoken');
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
  }
};

// Function to handle the login request
const getLogin = async (req, res) => {
  // Ensure the CSRF token and session cookies are fetched before making the login request
  await getCSRFToken();

  // Define login data using environment variables for sensitive information
  const data = {
    userName: "TP143127",
    password: "QaLnSzvjmTbH/kVEfsaso6XIpQLppurV3I4Yu/TlvWdxvpCg6eiekY+K8TL3lAme5R2+FMAd3qjDXN6Vu0xxPVJ6UzUoINfCb8nQSE10w/ZvWMNbShp+I9LDp/UnDeg8xnsOGqxOl3h9z/FsE/Nq6H5OfUEYp+aAlA/B9Iuv+Ou6AdgSBEbMMrbe4xwoibpQhRL2gwNPsV0mln3wgD18apK2fF1PLBdP4oK1He9pT9r4cv2Rp1QBayNw9XZ87ojJahY3mlu6ulfMooHsicp4cZvL8uSDafHhH+u5lRTN4fUj4MF9iO83gjCNmFZww7ygOTeur1RGhvK/YEPhM+n6dD1ZcNKISingoWDpl1hHJ4WmO7plJfyz9ZUGE6gvPDfpidA3prJMvr7/fjuPK5/Jn2aUUMpwdYXWmy4QCCp3t55ca4av+vqmB1WWlw5P6BUquq7FdkU7LeYU8e+NKuRIcfV3f61XPzwErE87Qp2c0jIAg7MtOBm+smFzu4AG6cQPVKbzNShZkLvbbnzfc02ntquC1a+gRabhzlDsuUpvZDw2FGX152h4xEIrlUYigUwOqATaYXk6m2gRXoRfF2ohta+gtjuvdQ2a2gVaCFlwfXCyEiwJGn/rm/w2hzMzYnwirkr+0Th4RNXF7y6kGeTQCzkLhNau5bDjJgierWvgfkU=5db3J",
  };

  // Check if the CSRF token was fetched successfully
  if (!csrfToken) {
    return res.status(500).json({ message: 'Failed to retrieve CSRF token' });
  }

  // Define headers with the CSRF token and session cookies
  const headers = {
    'X-Csrf-Token': csrfToken,
    'Content-Type': 'application/json',
    'Cookie': sessionCookies, // Include session cookies captured during CSRF token fetch
  };
  console.log(JSON.stringify(data))
  try {
    // Make the POST request to the login endpoint, include credentials to send the cookie
    const response = await axios.post(
      'https://adminservices.skillindiadigital.gov.in/api/user/v1/login',
      JSON.stringify(data),
      { headers, withCredentials: true } // Include credentials to send cookies with the request
    );

    // Send the successful response back to the client
    res.json({ message: response.data });
  } catch (error) {
    console.error('Login Error:', error.message);

    // Handle errors gracefully, checking if the error response exists
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : 'Login failed. Please try again later.';

    // Send the error response back to the client
    res.status(statusCode).json({ message: errorMessage });
  }
};




  const getSecretKey = async (req, res) => {
    axios.get('https://backend.itrackglobal.com/api/user/v1/getkey')
    .then(response => {
        console.log(response.headers); // Handle the response data here
        res.json({ message: response.headers })
    })
    .catch(error => {
        console.error('Error making GET request:', error);
    });
};


module.exports = {
    getCSRFToken,
    getSecretKey,
    getLogin,
};