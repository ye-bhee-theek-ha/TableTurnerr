// utils/withAuth.js
import { adminAuth } from '@/lib/firebase/firebaseAdmin';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import nookies from 'nookies';
import { DecodedIdToken } from 'firebase-admin/auth';

// Extend NextApiRequest to include the user property
export interface AuthenticatedRequest extends NextApiRequest {
  user: DecodedIdToken;
}

// Define the type for the handler that expects an AuthenticatedRequest
type AuthenticatedApiHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => void | Promise<void>;

/**
 * Higher-order function to protect API routes.
 * Verifies the session cookie and attaches user info to the request object.
 * @param handler The API route handler function.
 * @param requiredRole Optional role required to access the route.
 */
export function withAuth(
  handler: AuthenticatedApiHandler,
  requiredRole?: string | string[]
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = nookies.get({ req });
    const sessionCookie = cookies.session || '';

    if (!sessionCookie) {
      return res.status(401).json({ message: 'Unauthorized: No session cookie' });
    }

    try {
      // Verify the session cookie. `checkRevoked` is true to check if the session was revoked.
      const decodedToken = await adminAuth.verifySessionCookie(
        sessionCookie,
        true // Check for revocation
      );

      // Check for required role if specified
      if (requiredRole) {
        const userRole = decodedToken.role || 'customer'; // Assuming role is a custom claim
        const rolesToCheck = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!rolesToCheck.includes(userRole)) {
           console.warn(`Role check failed: User ${decodedToken.uid} (${userRole}) tried to access route requiring ${rolesToCheck.join('/')}`);
           return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
      }

      // Add user info to the request object for the handler to use
      // Cast req to AuthenticatedRequest before assigning user
      (req as AuthenticatedRequest).user = decodedToken;

      // Call the original handler
      return await handler(req as AuthenticatedRequest, res);

    } catch (error:any) {
      console.error('Error verifying session cookie:', error);
      // Clear potentially invalid cookie
      nookies.destroy({ res }, 'session', { path: '/' });
      if (error.code === 'auth/session-cookie-revoked') {
        return res.status(401).json({ message: 'Unauthorized: Session revoked' });
      }
      if (error.code === 'auth/session-cookie-expired') {
         return res.status(401).json({ message: 'Unauthorized: Session expired' });
      }
      return res.status(401).json({ message: 'Unauthorized: Invalid session cookie' });
    }
  };
}

/**
 * Middleware specifically for checking admin role.
 * Assumes 'admin' role is set as a custom claim or in the user's Firestore profile.
 * If checking claims: ensure 'role' claim is set via Admin SDK.
 * If checking Firestore: fetches profile, less performant but maybe simpler initially.
 *
 * This example checks a custom claim 'role'.
 */
export function withAdminAuth(handler: AuthenticatedApiHandler): NextApiHandler {
   // Use withAuth, requiring the 'admin' role claim
   return withAuth(handler, 'admin');

   // --- Alternative: Check Firestore Profile (less recommended for pure auth check) ---
   /*
   return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
         const userRef = adminDb.collection('users').doc(req.user.uid);
         const doc = await userRef.get();
         if (!doc.exists || doc.data()?.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Requires admin privileges' });
         }
         // Role verified, proceed with the handler
         return await handler(req, res);
      } catch (error) {
         console.error("Error checking admin role in Firestore:", error);
         return res.status(500).json({ message: "Failed to verify admin role" });
      }
   });
   */
}


