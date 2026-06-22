// api/verify.js
const crypto = require('crypto');

const SECRET = process.env.MAGIC_LINK_SECRET || 'hdtv-change-this-secret';
const BASE_URL = process.env.BASE_URL || 'https://student.hypnoticdreamtv.com';

function verifyToken(token, email) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [tokenEmail, expires, sig] = parts;
    if (tokenEmail.toLowerCase() !== email.toLowerCase()) return false;
    if (Date.now() > parseInt(expires)) return false;
    const payload = `${tokenEmail}:${expires}`;
    const expectedSig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    return sig === expectedSig;
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.redirect(`${BASE_URL}/login.html?error=invalid`);
  }

  const valid = verifyToken(token, decodeURIComponent(email));

  if (!valid) {
    return res.redirect(`${BASE_URL}/login.html?error=expired`);
  }

  const sessionValue = Buffer.from(
    JSON.stringify({ email: email.toLowerCase(), loginAt: Date.now() })
  ).toString('base64');

  res.setHeader('Set-Cookie',
    `hdtv_session=${sessionValue}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );

  return res.redirect(`${BASE_URL}/`);
};
