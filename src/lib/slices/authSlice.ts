import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  createUser, 
  signIn, 
  signOut, 
  sendVerificationCode,
  verifyPhoneNumber,
  getCurrentUser,
  updateUserProfile
} from "../firebase/services/auth";
import { User } from 'firebase/auth';

// Define types
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  phoneVerificationId: string | null;
  phoneVerificationSent: boolean;
  phoneVerified: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  phoneVerificationId: null,
  phoneVerificationSent: false,
  phoneVerified: false,
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, displayName, phoneNumber }: { email: string; password: string; displayName: string, phoneNumber: string }, { rejectWithValue }) => {
    try {
      console.log("Starting user registration process");
      const user = await createUser(email, password, displayName, phoneNumber);
      console.log("User created in Firebase Auth:", user.uid);
      
      // More detailed logging
      try {
        await updateUserProfile(user.uid, { 
          email, 
          displayName, 
          phoneVerified: false,
          phoneNumber
        });
        console.log("User profile updated in Firestore");
      } catch (firestoreError) {
        console.error("Failed to create Firestore document:", firestoreError);
        throw firestoreError;
      }
      
      return user;
    } catch (error: any) {
      console.error("Registration error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await signIn(email, password);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await signOut();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendPhoneVerification = createAsyncThunk(
  'auth/sendPhoneVerification',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const confirmationResult = await sendVerificationCode(phoneNumber);
      return confirmationResult.verificationId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPhone = createAsyncThunk(
  'auth/verifyPhone',
  async ({ 
    verificationId, 
    verificationCode,
    user
  }: { 
    verificationId: string; 
    verificationCode: string;
    user: User;
  }, { rejectWithValue }) => {
    try {
      const verifiedUser = await verifyPhoneNumber(verificationId, verificationCode, user);
      console.log("User verified: {inside auth slice}", verifiedUser);

      try {
        await updateUserProfile(user.uid, { 
          phoneVerified: true,
        });
        console.log("phoneVerified updated in Firestore");
      } catch (firestoreError) {
        console.error("failed to update verified phone :", firestoreError);
        throw firestoreError;
      }

      return verifiedUser;
    } catch (error: any) {
      console.error("Error verifying phone number:", error.message || error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPhoneVerification: (state) => {
      state.phoneVerificationId = null;
      state.phoneVerificationSent = false;
    }
  },
  extraReducers: (builder) => {
    // Register user
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login user
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout user
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.phoneVerified = false;
    });

    // Send phone verification
    builder.addCase(sendPhoneVerification.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendPhoneVerification.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.phoneVerificationId = action.payload;
      state.phoneVerificationSent = true;
    });
    builder.addCase(sendPhoneVerification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Verify phone
    builder.addCase(verifyPhone.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyPhone.fulfilled, (state) => {
      state.loading = false;
      state.phoneVerified = true;
    });
    builder.addCase(verifyPhone.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch current user
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    });
  },
});

export const { clearError, resetPhoneVerification } = authSlice.actions;
export default authSlice.reducer;