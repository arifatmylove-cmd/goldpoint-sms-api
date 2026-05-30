
// Termii API Key - Keep this on server (hidden from frontend)
const TERMII_API_KEY = 'TLvUxMhfOFHVofTptrwACkatzaFlBidVMEYHrPLZbogysaktHiImoBXLmmKyNm';
const TERMII_SENDER_ID = 'Goldpoint';
const TERMII_BASE_URL = 'https://v3.api.termii.com';

export default async function handler(req, res) {
  // Enable CORS for your app
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required fields: to and message' });
  }

  try {
    console.log(`Sending SMS to: ${to}`);
    console.log(`Message: ${message}`);

    const response = await fetch(`${TERMII_BASE_URL}/api/sms/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TERMII_API_KEY,
        to: to,
        from: TERMII_SENDER_ID,
        sms: message,
        type: 'plain',
        channel: 'generic'
      })
    });

    const data = await response.json();
    console.log('Termii Response:', data);

    if (data.code === 'ok') {
      return res.status(200).json({ 
        success: true, 
        message: 'SMS sent successfully',
        messageId: data.message_id,
        balance: data.balance
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: data.message || 'SMS sending failed' 
      });
    }
  } catch (error) {
    console.error('SMS Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
