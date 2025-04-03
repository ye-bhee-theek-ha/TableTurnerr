import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    PhoneAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    updateProfile,
    linkWithCredential,
    UserCredential,
    User
  } from 'firebase/auth';
  import { auth } from '../ClientApp';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { db } from '../ClientApp';
  
  // Create a new user with email and password
  export const createUser = async (email: string, password: string, displayName: string, phoneNumber: string) => {
    console.log("Creating user with email:", email, "and displayName:", displayName);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  

  let recaptchaVerifierInstance: RecaptchaVerifier | null = null;

  export const sendVerificationCode = async (phoneNumber: string) => {
    console.log("Sending verification code to phone number:", phoneNumber);
    try {
      // Always clean up any existing reCAPTCHA
      if (recaptchaVerifierInstance) {
        try {
          recaptchaVerifierInstance.clear();
        } catch (e) {
          console.log("Error clearing existing reCAPTCHA:", e);
        }
        recaptchaVerifierInstance = null;
      }
      
      // Clear the container's contents
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = '';
      }
      
      // Create a new div element for reCAPTCHA
      // This prevents the "already rendered" error by using a fresh element
      const newRecaptchaDiv = document.createElement('div');
      newRecaptchaDiv.id = 'recaptcha-container-' + Date.now(); // Unique ID
      
      // Replace the old container with the new one
      if (recaptchaContainer && recaptchaContainer.parentNode) {
        recaptchaContainer.parentNode.replaceChild(newRecaptchaDiv, recaptchaContainer);
      } else {
        // If the container doesn't exist, create it
        const body = document.body;
        newRecaptchaDiv.style.display = 'none'; // Hide it
        body.appendChild(newRecaptchaDiv);
      }
      
      // Create a new reCAPTCHA verifier with the new element
      recaptchaVerifierInstance = new RecaptchaVerifier(auth, newRecaptchaDiv.id, {
        size: 'invisible',
        callback: (response: any) => {
          console.log("reCAPTCHA verified successfully:", response);
        },
      });
      
      // Render the reCAPTCHA
      await recaptchaVerifierInstance.render();
      console.log("reCAPTCHA verifier created successfully on element:", newRecaptchaDiv.id);
      
      // Send verification code
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierInstance);
      console.log("Verification code sent successfully to:", phoneNumber);
      
      return confirmationResult;
    } catch (error: any) {
      console.error("Error sending verification code:", error.message || error);
      throw new Error(`Failed to send verification code: ${error.message || "Unknown error"}`);
    }
  };

  
  export const clearRecaptchaVerifier = () => {
    if (recaptchaVerifierInstance) {
      try {
        recaptchaVerifierInstance.clear();
      } catch (e) {
        console.log("Error clearing reCAPTCHA:", e);
      }
      recaptchaVerifierInstance = null;
    }
    
    // Also clean up any reCAPTCHA containers
    document.querySelectorAll('[id^="recaptcha-container-"]').forEach(el => {
      el.remove();
    });
  };

  export const verifyPhoneNumber = async (
    verificationId: string, 
    verificationCode: string, 
    user: User
  ) => {
    console.log(" inside auth.ts Verifying phone number with verificationId:", verificationId, "and verificationCode:", verificationCode);
    try {
      // Create phone auth credential
      const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
      
      // If user is already logged in, link the phone credential to their account
      if (user) {
        await linkWithCredential(user, phoneCredential);
        
        // Update user profile with phone number
        await updateUserProfile(user.uid, { phoneVerified: true, phoneNumber: user.phoneNumber });
        
        return user;
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  };
  
  // Sign in with email and password
  export const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  // Sign out
  export const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      throw error;
    }
  };
  
  // Update user profile in Firestore
  export const updateUserProfile = async (userId: string, data: any) => {

    console.log("Updating user profile in Firestore:", userId, data);
    
    try {
      const userRef = doc(db, 'users', userId);
      
      // Check if user document exists
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing document
        await setDoc(userRef, data, { merge: true });
      } else {
        // Create new document
        await setDoc(userRef, {
          ...data,
          createdAt: new Date(),
          loyaltyPoints: 0,
          role: 'customer', // Default role
          addresses: []
        });
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Get current user
  export const getCurrentUser = () => {
    return new Promise<User | null>((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  };
  