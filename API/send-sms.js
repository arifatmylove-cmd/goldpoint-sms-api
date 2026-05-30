const TERMII_API_KEY = 'TLvUxMhfOFHVofTptrwACkatzaFlBidVMEYrHPLZbogysaktHiImoBXLmmKyNm';
const TERMII_SENDER_ID = 'Goldpoint';
const TERMII_BASE_URL = 'https://v3.api.termii.com';

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
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

    if (data.code === 'ok') {
      return res.status(200).json({ 
        success: true, 
        message: 'SMS sent successfully'
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: data.message 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Server error: ' + error.message 
    });
  }
};
