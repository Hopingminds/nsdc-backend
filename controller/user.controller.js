const apiClient = require('../config/axiosConfig.js.js')
const axios = require('axios');
const forge = require('node-forge'); // Import node-forge for encryption (make sure to install it)

// Variables to store the CSRF token, session cookie, public key, and secret key globally
let csrfToken = '';
let sessionCookies = '';
let publicKey = '';
let secretKey = '';

// Function to get the CSRF token and session cookies
const getCSRFToken = async () => {
  try {
    // Make a HEAD request to fetch the CSRF token and session cookies
    const response = await apiClient.head('/api/user/v1', {
      withCredentials: true, // Include credentials to send/receive cookies
    });

    // Capture the CSRF token from response headers
    csrfToken = response.headers['x-csrf-token'];

    // Capture session cookies from the response
    sessionCookies = response.headers['set-cookie'] ? response.headers['set-cookie'].join('; ') : '';
  } catch (error) {
    console.error('Error fetching CSRF token:', error.message);
    throw new Error('Failed to fetch CSRF token');
  }
};

// Function to fetch the public key and secret key dynamically
const getPublicKeyAndSecret = async () => {
  try {
    // Make a GET request to fetch the public key and secret key
    const response = await apiClient.get('/api/user/v1/getkey', {
      withCredentials: true,
    });

    // Capture the public key and secret key from response data
    publicKey = response.data.publicKey;
    secretKey = response.data.secret;

  } catch (error) {
    console.error('Error fetching public key and secret:', error.message);
    throw new Error('Failed to fetch public key and secret');
  }
};

// Function to encrypt the password using the provided public key
const encryptPassword = (publicKeyPem, password, secret) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encryptedPassword = publicKey.encrypt(password, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
  });
  return forge.util.encode64(encryptedPassword) + secret;
};

// Function to handle the login request
const getLogin = async (req, res) => {
  const { tpId, password } = req.body; // Destructure tpId and password from request body

  try {
    // Ensure the CSRF token and session cookies are fetched before making the login request
    await getCSRFToken();

    // Ensure the public key and secret key are fetched before making the login request
    await getPublicKeyAndSecret();

    // If any of the required values were not successfully fetched, return an error
    if (!csrfToken || !sessionCookies || !publicKey || !secretKey) {
      return res.status(500).json({ message: 'Failed to retrieve CSRF token, session cookies, public key, or secret key' });
    }

    // Encrypt the password using the dynamically fetched public key and secret key
    const encryptedPassword = encryptPassword(publicKey, password, secretKey);
    // Prepare login data
    const loginData = {
      userName: tpId,
      password: encryptedPassword,
    };

    // Define headers with the CSRF token and session cookies
    const headers = {
      'X-Csrf-Token': csrfToken,
      'Content-Type': 'application/json',
      'Cookie': sessionCookies, // Include session cookies captured during CSRF token fetch
    };

    // Make the POST request to the login endpoint, including credentials to send the cookie
    const loginResponse = await apiClient.post(
      '/api/user/v1/login',
      JSON.stringify(loginData),
      { headers, withCredentials: true }
    );

    // Send the successful response back to the client
    return res.json({ message: loginResponse.data ,csrfToken,sessionCookies });
  } catch (error) {
    console.error('Login Error:', error.message);

    // Handle errors gracefully, checking if the error response exists
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : 'Login failed. Please try again later.';

    // Send the error response back to the client
    return res.status(statusCode).json({ message: errorMessage});
  }
};
module.exports = {
  getLogin,
};