"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import LoginForm from './Login';
import SignupForm from './Signup';
import PhoneVerificationForm from './PhoneVerification';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'phoneVerification'>(initialMode);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // State to handle component mount
  // This is to prevent the modal from rendering on the server side
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { 
    user, 
    loading, 
    error, 
    login, 
    signup, 
    clearAuthError,
    phoneVerified,
    sendVerification,
    verifyCode
  } = useAuth();

  useEffect(() => {
    // Reset states when modal is opened/closed
    if (!isOpen) {
      setTimeout(() => {
        setMode(initialMode);
        clearAuthError();
      }, 300); // Wait for animation to complete
    }
  }, [isOpen, initialMode, clearAuthError]);

  useEffect(() => {
    // Handle successful login
    if (user && mode === 'login') {
      onClose();
    }
  }, [user, mode, onClose]);

  const switchMode = (newMode: 'login' | 'signup') => {
    setSlideDirection(newMode === 'signup' ? 'left' : 'right');
    setMode(newMode);
  };

  const handlePhoneVerification = (phoneNum: string) => {
    setPhoneNumber(phoneNum);
    setMode('phoneVerification');
  };

  const handleResendCode = () => {
    // Just reset the verification state, the PhoneVerificationForm 
    // will handle sending a new code
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const slideVariants = {
    enterFromRight: { x: 300, opacity: 0 },
    enterFromLeft: { x: -300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exitToLeft: { x: -300, opacity: 0 },
    exitToRight: { x: 300, opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <>
    {mounted && isOpen && (
      <div className="fixed h-full inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-md"
        onClick={(e) => {
          // Close modal when clicking outside
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div 
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <AnimatePresence initial={false} custom={slideDirection} mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                custom={slideDirection}
                variants={slideVariants}
                initial={slideDirection === "right" ? "enterFromRight" : "enterFromLeft"}
                animate="center"
                exit={slideDirection === "right" ? "exitToRight" : "exitToLeft"}
                transition={{ duration: 0.3 }}
              >
                <LoginForm 
                  onSwitch={() => switchMode('signup')}
                  onLogin={login}
                  loading={loading}
                  error={error}
                  clearAuthError={clearAuthError}
                />
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                custom={slideDirection}
                variants={slideVariants}
                initial={slideDirection === "right" ? "enterFromRight" : "enterFromLeft"}
                animate="center"
                exit={slideDirection === "right" ? "exitToRight" : "exitToLeft"}
                transition={{ duration: 0.3 }}
              >
                <SignupForm 
                  onSwitch={() => switchMode('login')}
                  onSignup={signup}
                  onPhoneVerification={handlePhoneVerification}
                  loading={loading}
                  error={error}
                  clearAuthError={clearAuthError}
                />
              </motion.div>
            )}

            {mode === 'phoneVerification' && (
              <motion.div
                key="phoneVerification"
                variants={slideVariants}
                initial="enterFromRight"
                animate="center"
                exit="exitToLeft"
                transition={{ duration: 0.3 }}
              >
                <PhoneVerificationForm 
                  phoneNumber={phoneNumber}
                  onSendVerification={sendVerification}
                  onVerifyCode={verifyCode}
                  onResendCode={handleResendCode}
                  loading={loading}
                  error={error}
                  user={user}
                  clearAuthError={clearAuthError}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    )}
    </>
  );
};

export default AuthModal;