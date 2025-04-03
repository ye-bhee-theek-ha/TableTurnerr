import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../lib/store/store';
import { 
  fetchUserProfile, 
  addUserAddress, 
  updateUserAddress,
  clearUserError,
  updateUserProfile,
  setDefaultUserAddress,
  deleteUserAddress,
  resetUser,
} from '../lib/slices/userSlice';
import { Address } from '@/constants/types';


const useUser = (userId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, addresses, loading, error } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Fetch user profile when userId changes or auth user is available
    const currentUserId = userId || user?.uid;
    if (currentUserId && !profile) {
      dispatch(fetchUserProfile(currentUserId));
    }
  }, [dispatch, userId, user, profile]);
  
  const updateProfile = async (profileData: any) => {
    if (!user?.uid) return false;
    
    try {
      await dispatch(updateUserProfile({ userId: user.uid, profileData })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const addAddress = async (address: Omit<Address, 'id'>) => {
    console.log("inside addAddress", address);
    if (!user?.uid) return false;
    
    try {
      await dispatch(addUserAddress({ userId: user.uid, address })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!user?.uid) return false;
    
    try {
      await dispatch(deleteUserAddress({ userId: user.uid, addressId })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const updateAddress = async (address: Address) => {
    if (!user?.uid) return false;
    
    try {
      await dispatch(updateUserAddress({ userId: user.uid, address })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!user?.uid) return false;
    
    try {
      await dispatch(setDefaultUserAddress({ userId: user.uid, addressId })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const clearUserErrorMessage = () => {
    dispatch(clearUserError());
  };
  
  return {
    profile,
    addresses,
    loading,
    error,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearUserErrorMessage
  };
};

export default useUser;