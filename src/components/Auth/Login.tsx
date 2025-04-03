"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onSwitch: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearAuthError: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSwitch,
  onLogin,
  loading,
  error,
  clearAuthError
}) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(loginData.email, loginData.password);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear any auth errors
    if (error) {
      clearAuthError();
    }
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
      <motion.h2 variants={itemVariants} className="text-h5 font-bold mb-6 text-center">Log In</motion.h2>
      
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
      
      <form onSubmit={handleLoginSubmit}>
        <motion.div variants={itemVariants} className="mb-4">
          <label htmlFor="login-email" className="block text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="login-email"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-4">
          <label htmlFor="login-password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="login-password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={loginData.rememberMe}
              onChange={handleInputChange}
              className="mr-2 focus:ring-primary focus:ring-2"
            />
            <label htmlFor="rememberMe" className="text-gray-700">
              Remember me
            </label>
          </div>
          
          <a href="/forgot-password" className="text-primary hover:underline">
            Forgot Password?
          </a>
        </motion.div>
        
        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 disabled:bg-primary/50 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Logging In...' : 'Log In'}
        </motion.button>
      </form>
      
      <motion.div variants={itemVariants} className="mt-4 text-center">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <button 
            onClick={onSwitch}
            className="text-primary hover:underline font-medium transition-colors duration-200"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;