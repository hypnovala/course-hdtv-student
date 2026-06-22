// api/verify.js
const crypto = require('crypto');

const SECRET = process.env.MAGIC_LINK_SECRET || 'hdtv-change-this-secret';
const BASE_URL = process.env.BASE_URL || 'https://student.hypnoticdreamtv.com';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'hypnoticalstv@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@hypnoticdreamtv.com';

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

  const studentEmail = decodeURIComponent(email).toLowerCase();

  // Set a session cookie (httpOnly, 7 days)
  const sessionValue = Buffer.from(
    JSON.stringify({ email: studentEmail, loginAt: Date.now() })
  ).toString('base64');

  res.setHeader('Set-Cookie',
    `hdtv_session=${sessionValue}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );

  // ── LOGIN NOTIFICATION EMAIL ──────────────────────────────────
  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `HDTV Portal <${FROM_EMAIL}>`,
        to: NOTIFY_EMAIL,
        subject: `🔐 HDTV Login — ${studentEmail}`,
        html: `
          <div style="font-family:Arial,sans-serif; max-width:480px; margin:0 auto; background:#f0ebe3; padding:32px 20px;">
            <div style="background:#1a1208; border-radius:10px; overflow:hidden;">
              <div style="padding:24px 28px; border-bottom:2px solid #c9a84c;">
                <p style="color:#c9a84c; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; margin:0 0 4px;">HypnoticDream TV</p>
                <h2 style="color:#f5f2ec; font-size:20px; margin:0;">Student Login Notification</h2>
              </div>
              <div style="padding:24px 28px;">
                <table style="width:100%; border-collapse:collapse;">
                  <tr>
                    <td style="color:#7a8099; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; padding:8px 0; border-bottom:1px solid #1e2535;">Student Email</td>
                    <td style="color:#f5f2ec; font-size:14px; font-weight:600; padding:8px 0; border-bottom:1px solid #1e2535; text-align:right;">${studentEmail}</td>
                  </tr>
                  <tr>
                    <td style="color:#7a8099; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; padding:8px 0; border-bottom:1px solid #1e2535;">Time</td>
                    <td style="color:#f5f2ec; font-size:14px; padding:8px 0; border-bottom:1px solid #1e2535; text-align:right;">${timestamp}</td>
                  </tr>
                  <tr>
                    <td style="color:#7a8099; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; padding:8px 0;">Portal</td>
                    <td style="color:#c9a84c; font-size:14px; padding:8px 0; text-align:right;">student.hypnoticdreamtv.com</td>
                  </tr>
                </table>
              </div>
              <div style="padding:16px 28px; background:#0f0d08;">
                <p style="color:#4a5270; font-size:11px; margin:0;">© 2026 HypnoticDream TV · Automated login alert</p>
              </div>
            </div>
          </div>
        `
      })
    });
  } catch (err) {
    // Don't block login if notification fails — log silently
    console.error('Login notification failed:', err.message);
  }
  // ─────────────────────────────────────────────────────────────

  return res.redirect(`${BASE_URL}/`);
};
