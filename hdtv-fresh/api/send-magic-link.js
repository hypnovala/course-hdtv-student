// api/send-magic-link.js
const crypto = require('crypto');

// ─── ADD ENROLLED STUDENT EMAILS HERE ────────────────────────────
const APPROVED_EMAILS = [
  // 'student@example.com',
];
// ─────────────────────────────────────────────────────────────────

const SECRET = process.env.MAGIC_LINK_SECRET || 'hdtv-change-this-secret';
const BASE_URL = process.env.BASE_URL || 'https://student.hypnoticdreamtv.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'hypnoticalstv@gmail.com';

function generateToken(email) {
  const expires = Date.now() + 1000 * 60 * 30;
  const payload = `${email}:${expires}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const isApproved = APPROVED_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail);

  // Always return same message to avoid exposing who is enrolled
  if (!isApproved) {
    return res.status(200).json({ message: 'If that email is enrolled, a login link is on its way.' });
  }

  const token = generateToken(normalizedEmail);
  const magicLink = `${BASE_URL}/api/verify?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `HypnoticDream TV <${FROM_EMAIL}>`,
      to: normalizedEmail,
      subject: 'Your HDTV Login Link',
      html: `
        <div style="background:#f0ebe3;padding:40px 20px;font-family:Arial,sans-serif;">
          <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;">
            <div style="background:#1a1208;padding:32px;text-align:center;border-bottom:3px solid #c9a84c;">
              <div style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#8b6b20);color:#000;font-size:20px;font-weight:700;width:48px;height:48px;line-height:48px;border-radius:8px;">HD</div>
              <p style="color:#c9a84c;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:12px 0 0;">HypnoticDream TV</p>
            </div>
            <div style="padding:40px 36px;text-align:center;">
              <h2 style="font-size:26px;color:#1a1410;margin-bottom:10px;">Your Login Link</h2>
              <p style="font-size:14px;color:#6b5e4a;line-height:1.6;margin-bottom:32px;">
                Click the button below to access your HDTV student portal.<br>
                This link expires in <strong>30 minutes</strong>.
              </p>
              <a href="${magicLink}" style="display:inline-block;background:#c9a84c;color:#000;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:16px 36px;border-radius:4px;">
                Access My Course →
              </a>
              <p style="font-size:11px;color:#8c7d68;margin-top:28px;line-height:1.6;">
                Didn't request this? Ignore this email.<br>
                Questions? <a href="mailto:hypnoticalstv@gmail.com" style="color:#8b6b20;">hypnoticalstv@gmail.com</a>
              </p>
            </div>
            <div style="background:#1a1208;padding:20px;text-align:center;">
              <p style="font-size:11px;color:#6b5820;margin:0;">© 2026 HypnoticDream TV · student.hypnoticdreamtv.com</p>
            </div>
          </div>
        </div>
      `,
    }),
  });

  if (!resendRes.ok) {
    return res.status(500).json({ error: 'Failed to send email' });
  }

  return res.status(200).json({ message: 'If that email is enrolled, a login link is on its way.' });
};
