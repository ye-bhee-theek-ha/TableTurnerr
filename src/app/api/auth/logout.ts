
// pages/api/auth/logout.js
import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // Clear the session cookie
    nookies.destroy({ res }, 'session', {
      path: '/', // Must match the path used when setting the cookie
    });
    res.status(200).json({ status: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Error destroying session cookie:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
