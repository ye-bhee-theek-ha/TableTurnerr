// pages/api/user/profile.js

import { withAuth, AuthenticatedRequest } from '@/utils/withAuth';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { NextApiResponse } from 'next';
import { z } from 'zod'; // Using Zod for validation

// Define validation schema for profile updates
const profileUpdateSchema = z.object({
  displayName: z.string().min(1, 'Display name cannot be empty'),
  phoneNumber: z.string().optional(),
  photoURL: z.string().url('Invalid URL format').nullable().optional(),
	email: z.string().email('Invalid email format').optional(),
	loyaltyPoints: z.number().optional(),
	role: z.enum(['customer', 'employee', 'admin']).optional(),
});


async function profileHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.user.uid; // Get user ID from authenticated session

  if (req.method === 'GET') {
    // GET - Fetch user profile (similar logic to /api/auth/me, maybe consolidate)
    try {
      const userRef = adminDb.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User profile not found' });
      }
      // Return only necessary, non-sensitive profile data
      const { email, role, loyaltyPoints, displayName, phoneNumber, photoURL } = userDoc.data() || {};
      res.status(200).json({ email, role, loyaltyPoints, displayName, phoneNumber, photoURL });

    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }

  } else if (req.method === 'PUT' || req.method === 'POST') {
    // PUT/POST - Update user profile
    try {
      // Validate incoming data
      const validationResult = profileUpdateSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: 'Invalid data', errors: validationResult.error.errors });
      }

      const profileDataToUpdate = validationResult.data;

      // Ensure no forbidden fields are being updated (e.g., role, loyaltyPoints)
      delete profileDataToUpdate.role;
      delete profileDataToUpdate.loyaltyPoints;
      // Add other fields that users should NOT be able to update directly

      if (Object.keys(profileDataToUpdate).length === 0) {
         return res.status(400).json({ message: 'No valid fields provided for update.' });
      }


      const userRef = adminDb.collection('users').doc(userId);
      await userRef.update({
          ...profileDataToUpdate,
          updatedAt: new Date().toISOString() // Track updates
      });

      res.status(200).json({ message: 'Profile updated successfully', data: profileDataToUpdate });

    } catch (error) {
      console.error(`Error updating profile for user ${userId}:`, error);
      res.status(500).json({ message: 'Failed to update user profile' });
    }

  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(profileHandler); // Protect this route

