
// pages/api/auth/me.js 
import { withAuth } from '@/utils/withAuth'; // Assuming withAuth middleware is created (see below)
import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

// Extend NextApiRequest to include the user property added by middleware
interface AuthenticatedRequest extends NextApiRequest {
  user: import('firebase-admin/auth').DecodedIdToken;
}

async function meHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
    return
  }

  const user = req.user; // User info from verified session cookie (via withAuth)

  try {
    // Fetch additional profile data from Firestore if needed
    const userRef = adminDb.collection('users').doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // This case might indicate an inconsistency, handle appropriately
      console.warn(`Firestore profile not found for authenticated user: ${user.uid}`);
       return res.status(404).json({ message: 'User profile not found' });
    }

    const profileData = userDoc.data();

    // Return combined auth claims and profile data
    // Only return necessary fields, don't expose everything
    res.status(200).json({
      uid: user.uid,
      email: user.email,
      displayName: profileData?.displayName || user.name || '', // Fallback if needed
      role: profileData?.role || 'customer', // Get role from Firestore profile
      loyaltyPoints: profileData?.loyaltyPoints || 0,
      photoURL: profileData?.photoURL || user.picture || null,
      // Add other necessary profile fields
    });

  } catch (error) {
     console.error('Error fetching user profile in /api/auth/me:', error);
     res.status(500).json({ message: 'Failed to fetch user profile data' });
  }
}

// Protect the route using the authentication middleware
export default withAuth(meHandler);