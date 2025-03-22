// M-Pesa Transaction Status API Endpoint

// Import required modules
const fetch = require('node-fetch');

// Load environment variables
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const PASSKEY = process.env.MPESA_PASSKEY;

// Function to get M-Pesa access token
async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

// Function to check transaction status
async function checkTransactionStatus(checkoutRequestID) {
  try {
    // Get access token
    const accessToken = await getAccessToken();
    
    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
    
    // Generate password
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
    
    // Prepare request body
    const requestBody = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID
    };
    
    // Make query request
    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    // In a real application, you would check your database for the transaction status
    // This is a simplified example
    
    if (data.ResponseCode === '0') {
      if (data.ResultCode === '0') {
        return {
          success: true,
          message: 'Transaction completed successfully',
          status: 'COMPLETED'
        };
      } else {
        return {
          success: false,
          message: data.ResultDesc || 'Transaction failed',
          status: 'FAILED'
        };
      }
    } else if (data.ResponseCode === '2001') {
      // Transaction is still being processed
      return {
        success: false,
        message: 'Transaction is pending',
        status: 'PENDING'
      };
    } else {
      return {
        success: false,
        message: data.ResponseDescription || 'Failed to check transaction status',
        status: 'UNKNOWN'
      };
    }
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return {
      success: false,
      message: 'Internal server error',
      status: 'ERROR'
    };
  }
}

// API handler
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle GET request
  if (req.method === 'GET') {
    const { id } = req.query;
    
    // Validate required fields
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Checkout request ID is required',
        status: 'ERROR'
      });
    }
    
    // Check transaction status
    const result = await checkTransactionStatus(id);
    
    return res.status(200).json(result);
  }
  
  // Handle other methods
  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
    status: 'ERROR'
  });
};