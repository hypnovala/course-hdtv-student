// api/verify.js
// Vercel serverless function — validates the magic link token,
// sets a secure session cookie, redirects to the course.

const crypto = require('crypto');

const SECRET = process.env.MAGIC_LINK_SECRET || 'hdtv-change-this-secret';
const BASE_URL = process.env.BASE_URL || 'https://student.hypnoticdreamtv.com';

function verifyToken(token, email) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;

    const [tokenEmail, expires, sig] = parts;

    // Check email matches
    if (tokenEmail.toLowerCase() !== email.toLowerCase()) return false;

    // Check expiry
    if (Date.now() > parseInt(expires)) return false;

    // Verify signature
    const payload = `${tokenEmail}:${expires}`;
    const expectedSig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    if (sig !== expectedSig) return false;

    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.redirect(`${BASE_URL}/login.html?error=invalid`);
  }

  const valid = verifyToken(token, decodeURIComponent(email));

  if (!valid) {
    return res.redirect(`${BASE_URL}/login.html?error=expired`);
  }

  // Set a session cookie (httpOnly, 7 days)
  const sessionValue = Buffer.from(
    JSON.stringify({ email: email.toLowerCase(), loginAt: Date.now() })
  ).toString('base64');

  res.setHeader('Set-Cookie',
    `hdtv_session=${sessionValue}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );

  // Redirect to course
  return res.redirect(`${BASE_URL}/`);
}
