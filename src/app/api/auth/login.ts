// pages/api/auth/login.js
import { adminAuth } from '@/lib/firebase/firebaseAdmin';
import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies'; // Using nookies for easier cookie handling

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'ID token is required.' });
  }

  // Set session expiration to 14 days. Adjust as needed.
  const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days in milliseconds

  try {
    // Verify the ID token and decode its claims.
    const decodedIdToken = await adminAuth.verifyIdToken(idToken);

    // Only process if the user just signed in in the last 5 minutes.
    // This helps mitigate replay attacks if the token was somehow stolen.
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
      // Create session cookie.
      const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });

      // Set cookie policy for session cookie.
      const options = {
        maxAge: expiresIn / 1000, // maxAge is in seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        path: '/',
        sameSite: 'lax' as const, // Recommended SameSite policy
      };

      nookies.set({ res }, 'session', sessionCookie, options);

      // Optionally fetch user profile data here to return immediately
      // const userProfile = await fetchUserProfileData(decodedIdToken.uid);

      res.status(200).json({ status: true, message: 'Login successful' }); // Include userProfile if fetched
    } else {
      // Token is too old. Require re-authentication.
      res.status(401).json({ message: 'Recent sign-in required.' });
    }
  } catch (error:any) {
    console.error('Error creating session cookie:', error);
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
}


