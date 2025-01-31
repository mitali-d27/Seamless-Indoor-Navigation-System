const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const { MessagingResponse } = require('twilio').twiml;
const twilio = require('twilio');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Twilio credentials
const accountSid = process.env.REACT_APP_STD_KIT_TOKEN;;
const authToken = process.env.REACT_APP_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send-sos', async (req, res) => {
  const toPhoneNumber = req.body.toPhoneNumber; // Correct parameter name
  const fromPhoneNumber = req.body.fromPhoneNumber;
  const sosMessage = req.body.sosMessage;

  try {
    const message = await client.messages.create({
      body: sosMessage,
      from: fromPhoneNumber,
      to: toPhoneNumber,
    });

    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, error: 'Failed to send SMS' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
