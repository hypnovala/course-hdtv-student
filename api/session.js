// api/session.js
// Vercel serverless function — checks if the visitor has a valid session cookie.
// Called by the frontend on page load to decide whether to show
// the login gate or the course content.

export default async function handler(req, res) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/hdtv_session=([^;]+)/);

  if (!match) {
    return res.status(401).json({ loggedIn: false });
  }

  try {
    const session = JSON.parse(Buffer.from(match[1], 'base64').toString('utf8'));
    const sevenDays = 1000 * 60 * 60 * 24 * 7;

    if (!session.email || Date.now() - session.loginAt > sevenDays) {
      return res.status(401).json({ loggedIn: false });
    }

    return res.status(200).json({ loggedIn: true, email: session.email });
  } catch {
    return res.status(401).json({ loggedIn: false });
  }
}
