// Server-side code for M-Pesa integration
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Improved environment variable loading
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3002;

// Enable debug mode
const DEBUG = true;

// Add debug logging function
function debugLog(...args) {
  if (DEBUG) {
    console.log(`[DEBUG ${new Date().toISOString()}]`, ...args);
  }
}

// Add CORS support
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  debugLog(`${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.send('M-Pesa payment server is running. Use /mpesa endpoint for payment requests.');
});

// M-Pesa payment endpoint - FIXED VERSION
app.post('/mpesa', async (req, res) => {
  debugLog("Request body:", req.body);
  
  const { phoneNumber, amount, reference, description } = req.body;

  // Validate required parameters
  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "Missing phone number parameter" });
  }
  
  if (!amount) {
    return res.status(400).json({ success: false, message: "Missing amount parameter" });
  }

  try {
    // Get credentials from environment variables
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE || "174379";
    const passkey = process.env.MPESA_PASSKEY;
    
    // Validate required credentials
    if (!consumerKey || !consumerSecret || !passkey) {
      debugLog("Missing M-Pesa API credentials:", {
        consumerKey: !!consumerKey,
        consumerSecret: !!consumerSecret,
        passkey: !!passkey
      });
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error: Missing M-Pesa API credentials" 
      });
    }
    
    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
    
    debugLog("Requesting M-Pesa access token");
    
    // Get access token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    
    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", 
      { 
        headers: { Authorization: `Basic ${auth}` },
        timeout: 10000 // 10 seconds timeout
      }
    );
    
    const accessToken = tokenResponse.data.access_token;
    debugLog("Access token received");

    // Use the actual URL of your server for the callback
    const callbackUrl = `https://fast-turkey-8.loca.lt/callback`;
    debugLog("Using callback URL:", callbackUrl);
    
    // Send STK push request
    debugLog("Sending STK push request");
    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: reference || "Cafe Order",
        TransactionDesc: description || "Payment for cafe order"
      },
      { 
        headers: { 
          Authorization: `Bearer ${accessToken}`, 
          "Content-Type": "application/json" 
        },
        timeout: 10000
      }
    );

    debugLog("STK push response:", stkResponse.data);
    
    // Return success response
    res.status(200).json({ 
      success: true, 
      message: "M-Pesa request sent! Check your phone.",
      requestId: stkResponse.data.CheckoutRequestID
    });
  } catch (error) {
    debugLog("M-Pesa Error:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: "Payment request failed.", 
      error: error.response?.data || error.message 
    });
  }
});

// Callback endpoint
app.post('/callback', (req, res) => {
  debugLog("M-Pesa Callback Received:", req.body);
  res.status(200).json({ success: true, message: "Callback received successfully" });
});

// Payment status endpoint - NEW ENDPOINT
app.get('/payment-status', (req, res) => {
  const { reference, count } = req.query;
  
  if (!reference) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing reference parameter" 
    });
  }
  
  debugLog(`Payment status check for reference: ${reference}, attempt: ${count}`);
  
  // For demo purposes, we'll randomly return success or pending
  // In production, you would check the actual status from your database
  const statuses = ['pending', 'completed', 'pending'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  // If it's the 5th attempt, always return completed for testing purposes
  const status = count === '5' ? 'completed' : randomStatus;
  
  res.status(200).json({
    success: true,
    reference,
    status,
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`M-Pesa server running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`Public URL (via localtunnel): https://fast-turkey-8.loca.lt`);
  
  // Log environment variable status (without revealing values)
  console.log("Environment variables status:");
  console.log("- MPESA_CONSUMER_KEY:", process.env.MPESA_CONSUMER_KEY ? "Set ✓" : "Not set ✗");
  console.log("- MPESA_CONSUMER_SECRET:", process.env.MPESA_CONSUMER_SECRET ? "Set ✓" : "Not set ✗");
  console.log("- MPESA_PASSKEY:", process.env.MPESA_PASSKEY ? "Set ✓" : "Not set ✗");
  console.log("- MPESA_SHORTCODE:", process.env.MPESA_SHORTCODE ? "Set ✓" : "Not set ✗");
  console.log("- SERVER_URL:", process.env.SERVER_URL || "Using default:https://fast-turkey-8.loca.lt");
});