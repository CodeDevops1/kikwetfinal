// M-Pesa Callback API Endpoint

// API handler
module.exports = async (req, res) => {
    try {
      // Log the callback data
      console.log('M-Pesa Callback Data:', JSON.stringify(req.body));
      
      // Extract the necessary information
      const { Body } = req.body;
      
      if (Body && Body.stkCallback) {
        const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;
        
        // In a production environment, you would:
        // 1. Store the transaction details in your database
        // 2. Update the order status
        // 3. Notify the user (e.g., via email, SMS, or WebSocket)
        
        if (ResultCode === 0) {
          // Transaction was successful
          // Extract payment details from CallbackMetadata
          let amount, mpesaReceiptNumber, transactionDate, phoneNumber;
          
          if (CallbackMetadata && CallbackMetadata.Item) {
            CallbackMetadata.Item.forEach(item => {
              if (item.Name === 'Amount') amount = item.Value;
              if (item.Name === 'MpesaReceiptNumber') mpesaReceiptNumber = item.Value;
              if (item.Name === 'TransactionDate') transactionDate = item.Value;
              if (item.Name === 'PhoneNumber') phoneNumber = item.Value;
            });
          }
          
          console.log(`Payment of ${amount} received from ${phoneNumber}, receipt: ${mpesaReceiptNumber}`);
        } else {
          // Transaction failed
          console.log(`Payment failed: ${ResultDesc}`);
        }
      }
      
      // Always respond with a success to acknowledge receipt
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error handling M-Pesa callback:', error);
      // Still return 200 to acknowledge receipt
      return res.status(200).json({ success: true });
    }
  };