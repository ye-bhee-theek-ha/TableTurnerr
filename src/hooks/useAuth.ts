
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../lib/store/store';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  sendPhoneVerification,
  verifyPhone,
  fetchCurrentUser,
  clearError
} from '../lib/slices/authSlice';
import { User } from 'firebase/auth';

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // TODO clear logs
    console.log("useAuth effect triggered - auth:", auth);

    // Check for current user on initial load
    dispatch(fetchCurrentUser());

    console.log("Current user fetched - auth:", auth);
  }, [dispatch]);
  
  const signup = async (email: string, password: string, displayName: string, phoneNumber:string) => {
    try {
      await dispatch(registerUser({ email, password, displayName, phoneNumber })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const sendVerification = async (phoneNumber: string) => {
    try {
      const verificationId = await dispatch(sendPhoneVerification(phoneNumber)).unwrap();
      return verificationId;
    } catch (error) {
      return null;
    }
  };
  
  const verifyCode = async (verificationId: string, verificationCode: string, user: User) => {
    try {
      await dispatch(verifyPhone({ verificationId, verificationCode, user })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const clearAuthError = () => {
    dispatch(clearError());
  };
  
  return {
    user: auth.user,
    loading: auth.loading,
    isLoggedIn: auth.user !== null,
    error: auth.error,
    phoneVerificationSent: auth.phoneVerificationSent,
    phoneVerified: auth.phoneVerified,
    signup,
    login,
    logout,
    sendVerification,
    verifyCode,
    clearAuthError
  };
};

export default useAuth;