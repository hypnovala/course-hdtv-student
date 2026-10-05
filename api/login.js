// api/login.js
const PASSWORD = process.env.COURSE_PASSWORD || 'hdtvedu2026';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password || password.trim() !== PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password. Please try again.' });
  }

  const sessionValue = Buffer.from(
    JSON.stringify({ authenticated: true, loginAt: Date.now() })
  ).toString('base64');

  res.setHeader('Set-Cookie',
    `hdtv_session=${sessionValue}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );

  return res.status(200).json({ success: true });
};
