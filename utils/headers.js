// utils/headers.js

const getHeaders = (req) => {
  // Extract necessary headers from the request
  const csrfToken = req.headers['x-csrf-token'] || req.headers['csrfToken'];
  const {sessionCookies} = req.body;
  const token = req.headers['authorization'] || req.headers['Authorization'] || req.headers['token'];

  if (!csrfToken || !sessionCookies || !token) {
    throw new Error('Required headers are missing');
  }

  // Return the headers in the required format
  return {
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken,
    'Authorization': token,
    'Cookie': sessionCookies,
  };
};

module.exports = getHeaders;
