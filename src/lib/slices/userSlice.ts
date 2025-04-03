import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/ClientApp';
import { Address, UserState } from '@/constants/types';

// Initial state
const initialState: UserState = {
  profile: null,
  addresses: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return rejectWithValue('User profile not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ 
    userId, 
    profileData 
  }: { 
    userId: string; 
    profileData: any 
  }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        displayName: profileData.displayName,
        phoneNumber: profileData.phoneNumber,
        photoURL: profileData.photoURL,
        // Add other profile fields as needed
      });
      
      return profileData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addUserAddress = createAsyncThunk(
  'user/addUserAddress',
  async ({ 
    userId, 
    address 
  }: { 
    userId: string; 
    address: Partial<Address> 
  }, { rejectWithValue, getState }) => {
    try {
      const userRef = doc(db, 'users', userId);
      const state = getState() as { user: UserState };
      const addresses = state.user.addresses || [];
      
      // If this is the first address or isDefault is true, we need to handle default logic
      let updatedAddress = {
        ...address,
        id: address.id || Date.now().toString(), // Use provided ID or generate one
        isDefault: address.isDefault || addresses.length === 0 // First address is default
      };
      
      // If setting this as default, we need to update other addresses
      if (updatedAddress.isDefault) {
        // Update existing addresses to remove default flag if necessary
        const updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
        
        // Add the new address
        updatedAddresses.push(updatedAddress as Address);
        
        // Update the whole addresses array
        await updateDoc(userRef, { addresses: updatedAddresses });
        return updatedAddresses;
      } else {
        // Just add the new address
        await updateDoc(userRef, {
          addresses: arrayUnion(updatedAddress)
        });
        
        return [...addresses, updatedAddress as Address];
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  'user/updateUserAddress',
  async ({ 
    userId, 
    address 
  }: { 
    userId: string; 
    address: Address 
  }, { rejectWithValue, getState }) => {
    try {
      const userRef = doc(db, 'users', userId);
      const state = getState() as { user: UserState };
      const addresses = state.user.addresses;
      
      // Handle default address logic
      let updatedAddresses;
      if (address.isDefault) {
        // Update all addresses: set isDefault false for all, then true for this one
        updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === address.id
        }));
      } else {
        // Just update this specific address
        updatedAddresses = addresses.map(addr => 
          addr.id === address.id ? address : addr
        );
        
        // Ensure at least one address is default
        const hasDefault = updatedAddresses.some(addr => addr.isDefault);
        if (!hasDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true;
        }
      }
      
      await updateDoc(userRef, { addresses: updatedAddresses });
      return updatedAddresses;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  'user/deleteUserAddress',
  async ({ 
    userId, 
    addressId 
  }: { 
    userId: string; 
    addressId: string 
  }, { rejectWithValue, getState }) => {
    try {
      const userRef = doc(db, 'users', userId);
      const state = getState() as { user: UserState };
      const addresses = state.user.addresses;
      
      // Find the address to remove
      const addressToRemove = addresses.find(addr => addr.id === addressId);
      if (!addressToRemove) {
        return rejectWithValue('Address not found');
      }
      
      // Remove the address
      let updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      
      // If we deleted the default address, make another one default
      if (addressToRemove.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      await updateDoc(userRef, { addresses: updatedAddresses });
      return updatedAddresses;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setDefaultUserAddress = createAsyncThunk(
  'user/setDefaultUserAddress',
  async ({ 
    userId, 
    addressId 
  }: { 
    userId: string; 
    addressId: string 
  }, { rejectWithValue, getState }) => {
    try {
      const userRef = doc(db, 'users', userId);
      const state = getState() as { user: UserState };
      const addresses = state.user.addresses;
      
      // Update all addresses: set isDefault to false except for the selected one
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      await updateDoc(userRef, { addresses: updatedAddresses });
      return updatedAddresses;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetUser: (state) => {
      state.profile = null;
      state.addresses = [];
    }
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      const userData = action.payload as any;
      state.profile = {
        displayName: userData.displayName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        photoURL: userData.photoURL || null,
        loyaltyPoints: userData.loyaltyPoints || 0,
        role: userData.role || 'customer',
      };
      state.addresses = userData.addresses || [];
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Update user profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = {
        ...state.profile!,
        ...action.payload
      };
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Add user address
    builder.addCase(addUserAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addUserAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload;
    });
    builder.addCase(addUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Update user address
    builder.addCase(updateUserAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload;
    });
    builder.addCase(updateUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Delete user address
    builder.addCase(deleteUserAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUserAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload;
    });
    builder.addCase(deleteUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Set default user address
    builder.addCase(setDefaultUserAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(setDefaultUserAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload;
    });
    builder.addCase(setDefaultUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUserError, resetUser } = userSlice.actions;
export default userSlice.reducer;