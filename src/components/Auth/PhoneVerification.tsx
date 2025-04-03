"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clearRecaptchaVerifier } from '@/lib/firebase/services/auth';

interface PhoneVerificationFormProps {
  phoneNumber: string;
  onSendVerification: (phoneNumber: string) => Promise<string | null>;
  onVerifyCode: (verificationId: string, verificationCode: string, user: any) => Promise<boolean>;
  onResendCode: () => void;
  loading: boolean;
  error: string | null;
  user: any;
  clearAuthError: () => void;
}

const PhoneVerificationForm: React.FC<PhoneVerificationFormProps> = ({
  phoneNumber,
  onSendVerification,
  onVerifyCode,
  onResendCode,
  loading,
  error,
  user,
  clearAuthError
}) => {
  
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);



  useEffect(() => {
    // Send verification code when component mounts
    handleSendVerificationCode();
    
    // Cleanup function
    return () => {
      // Clear any reCAPTCHA when component unmounts
      clearRecaptchaVerifier();
    };
  }, []);


  const handleSendVerificationCode = async () => {
    setVerificationError('');
    
    // Format phone number to E.164 format if necessary
    let formattedPhoneNumber = phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      formattedPhoneNumber = `+${phoneNumber}`;
    }

    try {
      const result = await onSendVerification(formattedPhoneNumber);
      
      if (result) {
        setVerificationId(result);
        setShowVerificationInput(true);
      } else {
        setVerificationError('Failed to send verification code. Please try again.');
      }
    } catch (error) {
      setVerificationError(`An error occurred while sending the verification code. Please try again. Error: ${error}`);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');
    
    if (!verificationCode.trim()) {
      setVerificationError('Please enter the verification code');
      return;
    }

    if (verificationId && user) {
      try {
        const result = await onVerifyCode(verificationId, verificationCode, user);
        
        if (result) {
          setVerificationSuccess(true);
        } else {
          setVerificationError('Invalid verification code. Please try again.');
        }
      } catch (error) {
        setVerificationError('An error occurred during verification. Please try again.');
      }
    } else {
      setVerificationError('Verification session expired. Please request a new code.');
    }
  };

  const handleResend = () => {
    setVerificationCode('');
    setVerificationId(null);
    setShowVerificationInput(false);
    setVerificationError('');

    clearRecaptchaVerifier();

    
    onResendCode();
    handleSendVerificationCode();
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="p-6"
    >
      <motion.h2 variants={itemVariants} className="text-h5 font-bold mb-6 text-center">
        Phone Verification
      </motion.h2>
      
      {error && (
        <motion.div 
          variants={itemVariants}
          className="mb-4 p-3 bg-red-100 text-red-700 rounded"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
        </motion.div>
      )}
      
      {verificationError && (
        <motion.div 
          variants={itemVariants}
          className="mb-4 p-3 bg-red-100 text-red-700 rounded"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {verificationError}
        </motion.div>
      )}
      
      {verificationSuccess ? (
        <motion.div
          variants={itemVariants}
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
            <p className="font-medium">Phone number verified successfully!</p>
            <p className="mt-2">You can now continue to your account.</p>
          </div>
          
          <motion.div
            className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 0, 0]
            }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          >
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              We've sent a verification code to:
            </p>
            <p className="font-medium text-gray-900">{phoneNumber}</p>
          </div>
          
          {showVerificationInput ? (
            <form onSubmit={handleVerifyCode}>
              <motion.div 
                variants={itemVariants}
                className="mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="verificationCode" className="block text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </motion.div>
              
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 disabled:bg-primary/50 transition-colors duration-200 mb-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </motion.button>
              
              <motion.button
                variants={itemVariants}
                type="button"
                onClick={handleResend}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Resend Code
              </motion.button>
            </form>
          ) : (
            <motion.div
              className="flex justify-center" 
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 0, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </motion.div>
          )}
        </motion.div>
      )}
      <div id="recaptcha-container"></div>
    </motion.div>
  );
};

export default PhoneVerificationForm;