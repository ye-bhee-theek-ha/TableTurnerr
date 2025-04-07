
// pages/api/user/addresses.ts

import { withAuth, AuthenticatedRequest } from '@/utils/withAuth';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { NextApiResponse } from 'next';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue

// Validation schema for a single address
const addressSchema = z.object({
  id: z.string().optional(), // ID might be generated or provided
  address: z.string().min(5, 'Address is too short'),
  isDefault: z.boolean().optional(),
});

// Validation for adding an address (isDefault might be omitted)
const addAddressSchema = addressSchema.omit({ id: true }).extend({
   isDefault: z.boolean().optional(),
});
// Validation for updating an address (requires ID)
const updateAddressSchema = addressSchema.extend({
   id: z.string(), // ID is required for update
});


async function addressesHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.user.uid;
  const userRef = adminDb.collection('users').doc(userId);

  try {
    // Fetch current addresses (needed for POST/PUT/DELETE logic)
    // Avoid fetching if only GET? Maybe not, simplifies logic below.
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
       return res.status(404).json({ message: "User profile not found." });
    }
    const currentAddresses: any[] = userDoc.data()?.addresses || []; // Assuming 'addresses' is the array field


    if (req.method === 'GET') {
      // GET - Fetch all addresses for the user
      res.status(200).json(currentAddresses);

    } else if (req.method === 'POST') {
      // POST - Add a new address
      const validationResult = addAddressSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: 'Invalid address data', errors: validationResult.error.errors });
      }

      const newAddressData = validationResult.data;
      const newAddress = {
        ...newAddressData,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Generate unique ID
        isDefault: newAddressData.isDefault ?? currentAddresses.length === 0, // Default if first or explicitly set
      };

      let updatedAddresses = [...currentAddresses];

      if (newAddress.isDefault) {
        // Set all others to non-default
        updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
      }
      updatedAddresses.push(newAddress);

      await userRef.update({ addresses: updatedAddresses });
      res.status(201).json(newAddress); // Return the newly created address with ID

    } else if (req.method === 'PUT') {
        // PUT - Update an existing address (or set default)
        const validationResult = updateAddressSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: 'Invalid address data for update', errors: validationResult.error.errors });
        }
        const addressToUpdate = validationResult.data;
        const addressId = addressToUpdate.id;

        let addressFound = false;
        let updatedAddresses = currentAddresses.map(addr => {
            if (addr.id === addressId) {
                addressFound = true;
                // If setting this one as default, ensure others are not
                if (addressToUpdate.isDefault) {
                    return { ...addr, ...addressToUpdate, isDefault: true };
                } else {
                    return { ...addr, ...addressToUpdate };
                }
            }
            // If the updated address is default, set this one to non-default
            return addressToUpdate.isDefault ? { ...addr, isDefault: false } : addr;
        });

        if (!addressFound) {
            return res.status(404).json({ message: `Address with ID ${addressId} not found.` });
        }

        // Ensure at least one address is default if addresses exist
        if (updatedAddresses.length > 0 && !updatedAddresses.some(addr => addr.isDefault)) {
           const firstAddressIndex = updatedAddresses.findIndex(addr => addr.id === addressId);
           // Make the updated one default if it wasn't explicitly set to false, otherwise make the first one default
           if (addressToUpdate.isDefault !== false && firstAddressIndex !== -1) {
               updatedAddresses[firstAddressIndex].isDefault = true;
           } else if (updatedAddresses.length > 0) {
               updatedAddresses[0].isDefault = true; // Fallback: make the first one default
           }
        }


        await userRef.update({ addresses: updatedAddresses });
        res.status(200).json(updatedAddresses.find(a => a.id === addressId));


    } else if (req.method === 'DELETE') {
      // DELETE - Remove an address
      const addressId = req.query.id as string; // Get ID from query param: /api/user/addresses?id=...
      if (!addressId) {
        return res.status(400).json({ message: 'Address ID is required in query parameters.' });
      }

      const initialLength = currentAddresses.length;
      let updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId);

      if (updatedAddresses.length === initialLength) {
         return res.status(404).json({ message: `Address with ID ${addressId} not found.` });
      }

       // Ensure at least one address is default if addresses remain
       if (updatedAddresses.length > 0 && !updatedAddresses.some(addr => addr.isDefault)) {
           updatedAddresses[0].isDefault = true; // Make the first remaining address default
       }


      await userRef.update({ addresses: updatedAddresses });
      res.status(200).json({ message: 'Address deleted successfully' });

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
      console.error(`Error handling addresses for user ${userId}:`, error);
      res.status(500).json({ message: 'Failed to process address request' });
  }
}

export default withAuth(addressesHandler); // Protect this route

