import React, { useEffect, useState } from "react";
import loginbg from '../assets/images/OtherImages/loginbg.jpeg';
import Logo from "../assets/images/OtherImages/Logo2.png";
import { LoginInput } from "../components";
import { FaEnvelope, FaLock, FaUser, FaPhone, FcGoogle,FaMapMarkedAlt } from "../assets/icons/index";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { app } from "../config/firebaseconfig";
import { validateUserJWTToken } from "../api";
import { setUserDetails } from "../context/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { alertSuccess, alertWarning, alertNULL } from "../context/actions/alertActions";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [user_name, setUser_name] = useState('');
  const [phone_number, setPhone_number] = useState('');import React, { useEffect, useState } from "react";
import loginbg from '../assets/images/OtherImages/loginbg.jpeg';
import Logo from "../assets/images/OtherImages/Logo2.png";
import  log  from '../assets/images/OtherImages/log.png';
import { LoginInput } from "../components";
import { FaEnvelope, FaLock, FaUser, FaPhone, FcGoogle,FaMapMarkedAlt } from "../assets/icons/index";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { app,db } from "../config/firebaseconfig";
import { validateUserJWTToken } from "../api";
import { setUserDetails } from "../context/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { alertSuccess, alertWarning, alertNULL } from "../context/actions/alertActions";
import { getDoc, doc,setDoc } from "firebase/firestore";


const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [user_name, setUser_name] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [address, setAddress] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const firebaseAuth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    const checkEmailVerification = async () => {
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) {
        try {
          await currentUser.reload();
          if (currentUser.emailVerified) {
            navigate("/", { replace: true });
          } else {
            dispatch(alertWarning('Email is not verified. Please check your inbox for the verification email.'));
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          }
        } catch (error) {
          console.error('Error reloading user:', error);
          dispatch(alertWarning('Please try again later.'));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        }
      }
    };

    checkEmailVerification();
  }, [navigate, dispatch]);

  const storeUserDetailsInRedux = (data) => {
    dispatch(setUserDetails(data));
  };

  const closeLoginPage = () => {
    navigate("/"); // Redirect to home or any other page
  };

  const loginWithGoogle = async () => {
    try {
      const userCred = await signInWithPopup(firebaseAuth, provider);
      const token = await userCred.user.getIdToken();
      const data = await validateUserJWTToken(token);
      storeUserDetailsInRedux(data);
      navigate("/", { replace: true });
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        dispatch(alertWarning('Sign-in popup was closed before completing the sign-in.'));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 5000);
      } else {
        dispatch(alertWarning('Please try again.'));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
    }
  };

  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      dispatch(alertSuccess('Verification email sent successfully'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } catch (error) {
      dispatch(alertWarning('Error sending verification email:', error));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  const signUpWithEmailPass = async () => {
    const validSymbols = /^[a-zA-Z0-9@#$%^&*!]+$/;
    const validEmail = /\S+@\S+\.\S+/;
    const phoneNumberRegex = /^\d{10}$/;
    const usernameRegex = /^(?!.*__)(?!.*--)[a-zA-Z0-9._-]{3,15}$/;
    const addressRegex = /^[a-zA-Z0-9\s,.-]{4,100}$/;

    if (userEmail === "" || password === "" || confirm_password === "" || user_name === "" || phone_number === "" || address === "") {
      dispatch(alertWarning("Please fill the required fields"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (!validEmail.test(userEmail)) {
      dispatch(alertWarning("Please enter a valid email address"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    /*if (!userEmail.endsWith('@gmail.com')) {
      dispatch(alertWarning("Please use a Gmail account"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }*/

    if (password !== confirm_password) {
      dispatch(alertWarning("Passwords don't match"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (password.length < 6 || confirm_password.length < 6) {
      dispatch(alertWarning("Password should be at least 6 characters"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (!password.match(validSymbols)) {
      dispatch(
        alertWarning(
          "Password can only contain letters, numbers, and @,#,$,%,^,&,*,! symbols"
        )
      );
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    // Function to validate the username
    
      if (!usernameRegex.test(user_name)) {
        // Check length separately for clarity
        if (user_name.length < 3 || user_name.length > 15) {
          dispatch(alertWarning("Username should be 3-15 characters long."));
        } else {
          dispatch(alertWarning("Username can only contain alphanumeric characters, underscores, periods, or hyphens."));
        }
        
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        return;
      }

    // Function to validate the phone number
    
      if (!phoneNumberRegex.test(phone_number)) {
        // Check length separately for clarity
        if (phone_number.length !== 10) {
          dispatch(alertWarning("Phone number should be exactly 10 digits long."));
        } else {
          dispatch(alertWarning("Phone number should contain only numeric characters."));
        }

        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        return;
      }

    // Function to validate the address
  
  if (!addressRegex.test(address)) {
    // Check length and character validity separately
    if (address.length < 4 || address.length > 50) {
      dispatch(alertWarning("Address should be 4-50 characters long."));
    } else {
      dispatch(alertWarning("Address can only contain letters, numbers, spaces, commas, periods, or hyphens."));
    }

    setTimeout(() => {
      dispatch(alertNULL());
    }, 3000);
    return;
  }

   
    else{
     
      setUserEmail("");
      setPassword("");
      setConfirm_password("");
      setUser_name('');
      setPhone_number("");
      setAddress("");
    }
    try {
      const userCred = await createUserWithEmailAndPassword(firebaseAuth, userEmail, password);
      await updateProfile(userCred.user,  {
        displayName: user_name,
        photoURL: 'https://your-image-host.com/path/to/your-image.jpg'

      }); 
      // Manually store user details in Redux
      const userData = {
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: user_name,
        phoneNumber: phone_number,
        address: address,
        photoURL: 'https://your-valid-image-url.com/path/to/image.jpg',
      };

      
      // Save user data in Firestore
       await setDoc(doc(db, "users", userCred.user.uid), userData);
      storeUserDetailsInRedux(userData); // Save to Redux
      
      setShowPopup(false);
      await sendVerificationEmail(userCred.user);
      dispatch(alertSuccess('Verification email sent. Please check your inbox.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } catch (error) {
      console.error("Signup error: ", error);
      if (error.code === 'auth/email-already-in-use') {
        dispatch(alertWarning('The email address is already in use by another account.'));
      } else if (error.code === 'auth/invalid-email') {
        dispatch(alertWarning('The email address is not valid.'));
      } else if (error.code === 'auth/operation-not-allowed') {
        dispatch(alertWarning('Email/password accounts are not enabled.'));
      } else {
        dispatch(alertWarning('An error occurred during sign-up. Please try again.'));
      }
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

 

const signInWithEmailAndPass = async () => {
  if (userEmail !== "" && password !== "") {
    try {
      const userCred = await signInWithEmailAndPassword(firebaseAuth, userEmail, password);
      
      if (userCred.user.emailVerified) {
        const token = await userCred.user.getIdToken();
        
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
        
        if (userDoc.exists()) {
          const userData = {
            uid: userDoc.id,
            email: userDoc.data().email,
            displayName: userDoc.data().displayName,
            phoneNumber: userDoc.data().phoneNumber,
            address: userDoc.data().address,
            photoURL: userDoc.data().photoURL,
          };
          storeUserDetailsInRedux(userData);
        } else {
          dispatch(alertWarning('No user data found in Firestore.'));
        }

        navigate("/", { replace: true });
      } else {
        dispatch(alertWarning('Email not verified. Please check your inbox.'));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
    } catch (error) {
      console.log("Firebase Auth Error:", error);
      if (error.code === 'auth/invalid-credential') {
        dispatch(alertWarning('Invalid email or password.'));
      } else if (error.code === 'auth/user-not-found') {
        dispatch(alertWarning('No user is found with this email.'));
      } else if (error.code === 'auth/wrong-password') {
        dispatch(alertWarning('Incorrect password.'));
      } else {
        dispatch(alertWarning('An error occurred during sign-in. Please try again.'));
      }
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  } else {
    dispatch(alertWarning('Check the password & fill the blanks'));
    setTimeout(() => {
      dispatch(alertNULL());
    }, 3000);
  }
};

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(firebaseAuth, userEmail);
      dispatch(alertSuccess('Password reset email sent. Please check your inbox.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } catch (error) {
      dispatch(alertWarning('Enter your email. and Please try again.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex p-2">
      {/* Background Image */}
      <img
        src={loginbg}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt=""
      />

     {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl text-white bg-black p-2 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={closeLoginPage}
        >
          &times;
        </button>


      {/* Content Box */}
      <div className="flex flex-col md:ml-[30%] items-center bg-cardOverlay w-full md:w-508 h-full z-10 backdrop-blur-sm p-4 px-4 py-8 gap-6 rounded-md">
        {/* Top Logo Section */}
        <div className="flex items-center justify-start gap-4 w-full">
          <img src={Logo} className="w-8" alt="" />
          <p className="text-black font-semibold text-2xl">O'Pizza shop</p>
        </div>

        {/* Welcome Text */}
        <p className="text-3xl font-semibold text-black">Welcome!!</p>
        <p className="text-xl text-black -mt-6">
          {isSignUp ? "Sign up" : "Sign in"} with following
        </p>

        {/* Input Section */}
        <div className="w-full flex flex-col items-center justify-center gap-5 px-4 md:px-10 py-4 -mt-4">
          <LoginInput
            placeHolder={"Email Here"}
            icon={<FaEnvelope className="text-xl text-black" />}
            inputState={userEmail}
            inputStateFunc={setUserEmail}
            type="email"
            isSignUp={isSignUp}
          />

          <LoginInput
            placeHolder={"Password Here"}
            icon={<FaLock className="text-xl text-black" />}
            inputState={password}
            inputStateFunc={setPassword}
            type="password"
            isSignUp={isSignUp}
          />

          {isSignUp && (
            <>
              <LoginInput
                placeHolder={"Confirm Password Here"}
                icon={<FaLock className="text-xl text-black" />}
                inputState={confirm_password}
                inputStateFunc={setConfirm_password}
                type="password"
                isSignUp={isSignUp}
              />
              <LoginInput
                placeHolder={"User Name Here"}
                icon={<FaUser className="text-xl text-black" />}
                inputState={user_name}
                inputStateFunc={setUser_name}
                type="text"
                isSignUp={isSignUp}
              />
              <LoginInput
                placeHolder={"Phone Number Here"}
                icon={<FaPhone className="text-xl text-black" />}
                inputState={phone_number}
                inputStateFunc={setPhone_number}
                type="tel"
                isSignUp={isSignUp}
              />

              <LoginInput
                placeHolder={"Address Here"}
                icon={<FaMapMarkedAlt className="text-xl text-black" />}
                inputState={address}
                inputStateFunc={setAddress}
                type="text"
                isSignUp={isSignUp}
              />
            </>
          )}

          {!isSignUp ? (
            <p>
              Doesn't have an account?{" "}
              <motion.button
                {...buttonClick}
                className="text-indigo-800 underline cursor-pointer bg-transparent"
                onClick={() => setShowPopup(true)}
              >
                Create one
              </motion.button>
            </p>
          ) : (
            <p>
              Already have an account:{" "}
              <motion.button
                {...buttonClick}
                className="text-indigo-800 underline cursor-pointer bg-transparent"
                onClick={() => setIsSignUp(false)}
              >
                Sign in here
              </motion.button>
            </p>
          )}

          {/* Button Section */}
          {isSignUp ? (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 -mt-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              onClick={signUpWithEmailPass}
            >
              Sign Up
            </motion.button>
          ) : (
            <>
              <motion.button
                {...buttonClick}
                onClick={signInWithEmailAndPass}
                className="w-full px-4 py-2 -mt-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              >
                Sign in
              </motion.button>
              <div className="flex justify-center">
                <motion.button
                  {...buttonClick}
                  className='text-sm text-blue-400 hover:text-blue-600 cursor-pointer'
                  onClick={resetPassword}
                >
                  Forgot Password
                </motion.button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-16 -mt-4">
          <div className="w-24 h-[1px] rounded-md bg-black"></div>
          <p className="text-black">or</p>
          <div className="w-24 h-[1px] rounded-md bg-black"></div>
        </div>

        <motion.div
          {...buttonClick}
          className="flex items-center justify-center px-20 py-2 bg-white backdrop-blur-md cursor-pointer rounded-3xl gap-4 -mt-2"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="text-3xl" />
          <p className="capitalize text-base text-black">
            Login with Google
          </p>
        </motion.div>
      </div>

      {/* Sign Up Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 ">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative ">
            <button className="absolute top-4 right-4 text-2xl " onClick={() => setShowPopup(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <LoginInput
              placeHolder={"Email Here"}
              icon={<FaEnvelope className="text-xl text-black" />}
              inputState={userEmail}
              inputStateFunc={setUserEmail}
              type="email"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
              
            />
            
            <LoginInput
              placeHolder={"Password Here"}
              icon={<FaLock className="text-xl text-black" />}
              inputState={password}
              inputStateFunc={setPassword}
              type="password"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
            />
            
            <LoginInput
              placeHolder={"Confirm Password Here"}
              icon={<FaLock className="text-xl text-black" />}
              inputState={confirm_password}
              inputStateFunc={setConfirm_password}
              type="password"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
            />
            
            <LoginInput
              placeHolder={"User Name Here"}
              icon={<FaUser className="text-xl text-black" />}
              inputState={user_name}
              inputStateFunc={setUser_name}
              type="text"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
            />
            
            <LoginInput
              placeHolder={"Phone Number Here"}
              icon={<FaPhone className="text-xl text-black" />}
              inputState={phone_number}
              inputStateFunc={setPhone_number}
              type="tel"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
            />
            
            <LoginInput
              placeHolder={"Address Here"}
              icon={<FaMapMarkedAlt className="text-xl text-black" />}
              inputState={address}
              inputStateFunc={setAddress}
              type="text"
              isSignUp={true}
              className="mt-3" // Add margin-bottom to create a gap
            />
            
            <button onClick={signUpWithEmailPass} className="bg-blue-500 text-white py-2 px-4 rounded mt-4">Sign Up</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;  
  const [address, setAddress] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const firebaseAuth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    const checkEmailVerification = async () => {
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) {
        try {
          await currentUser.reload();
          if (currentUser.emailVerified) {
            navigate("/", { replace: true });
          } else {
            dispatch(alertWarning('Email is not verified. Please check your inbox for the verification email.'));
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          }
        } catch (error) {
          console.error('Error reloading user:', error);
          dispatch(alertWarning('An error occurred while checking email verification status. Please try again later.'));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        }
      }
    };

    checkEmailVerification();
  }, [navigate, dispatch]);

  const storeUserDetailsInRedux = (data) => {
    dispatch(setUserDetails(data));
  };

  const closeLoginPage = () => {
    navigate("/"); // Redirect to home or any other page
  };

  const loginWithGoogle = async () => {
    try {
      const userCred = await signInWithPopup(firebaseAuth, provider);
      const token = await userCred.user.getIdToken();
      const data = await validateUserJWTToken(token);
      storeUserDetailsInRedux(data);
      navigate("/", { replace: true });
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        dispatch(alertWarning('Sign-in popup was closed before completing the sign-in.'));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 5000);
      } else {
        dispatch(alertWarning('An error occurred during sign-in. Please try again.'));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
    }
  };

  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      dispatch(alertSuccess('Verification email sent successfully'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } catch (error) {
      dispatch(alertWarning('Error sending verification email:', error));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  const signUpWithEmailPass = async () => {
    const validSymbols = /^[a-zA-Z0-9@#$%^&*!]+$/;
    const validEmail = /\S+@\S+\.\S+/;
    const phoneNumberRegex = /^\d{10}$/;
    const usernameRegex = /^[a-zA-Z0-9_.-]{3,15}$/;
    const addressRegex =/^[a-zA-Z0-9\s,.-]{4,100}$/;

    if (userEmail === "" || password === "" || confirm_password === "" || user_name === "" || phone_number === "" || address === "") {
      dispatch(alertWarning("Please fill the required fields"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (!validEmail.test(userEmail)) {
      dispatch(alertWarning("Please enter a valid email address"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    /*if (!userEmail.endsWith('@gmail.com')) {
      dispatch(alertWarning("Please use a Gmail account"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }*/

    if (password !== confirm_password) {
      dispatch(alertWarning("Passwords don't match"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (password.length < 6 || confirm_password.length < 6) {
      dispatch(alertWarning("Password should be at least 6 characters"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (!password.match(validSymbols)) {
      dispatch(
        alertWarning(
          "Password can only contain letters, numbers, and @,#,$,%,^,&,*,! symbols"
        )
      );
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (!usernameRegex.test(user_name)) {
      dispatch(alertWarning("Invalid username. It should be 3-15 characters long and contain only alphanumeric characters, underscores, periods, or hyphens."));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (!phoneNumberRegex.test(phone_number)) {
      dispatch(alertWarning("Invalid phone number. It should be exactly 10 digits long and contain only numeric characters."));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (!addressRegex.test(address)) {
      dispatch(alertWarning("Address should be 4-100 characters long and contain only letters, numbers, spaces, commas, periods, or hyphens."));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }
    else{
     
      setUserEmail("");
      setPassword("");
      setConfirm_password("");
      setUser_name('');
      setPhone_number("");
      setAddress("");
    }
    try {
      const userCred = await createUserWithEmailAndPassword(firebaseAuth, userEmail, password);
      await updateProfile(userCred.user,  {
        displayName: user_name,
        photoURL: 'https://example.com/photo.jpg' // Test with a valid URL
      }); 
      // Manually store user details in Redux
      const userData = {
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: user_name,
        phoneNumber: phone_number,
        address: address,
        photoURL: userCred.user.photoURL,
      };

      storeUserDetailsInRedux(userData); // Save to Redux
      
      setShowPopup(false);
      await sendVerificationEmail(userCred.user);
      dispatch(alertSuccess('Verification email sent. Please check your inbox. You need to verify your email before logging in.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } catch (error) {
      console.error("Signup error: ", error);
      if (error.code === 'auth/email-already-in-use') {
        dispatch(alertWarning('The email address is already in use by another account. Please try signing in or use a different email.'));
      } else if (error.code === 'auth/invalid-email') {
        dispatch(alertWarning('The email address is not valid.'));
      } else if (error.code === 'auth/operation-not-allowed') {
        dispatch(alertWarning('Email/password accounts are not enabled.'));
      } else {
        dispatch(alertWarning('An error occurred during sign-up. Please try again.'));
      }
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  const signInWithEmailAndPass = async () => {
    if (userEmail !== "" && password !== "") {
      try {
        const userCred = await signInWithEmailAndPassword(firebaseAuth, userEmail, password);
        if (userCred.user.emailVerified) {
          const token = await userCred.user.getIdToken();
          const data = await validateUserJWTToken(token);
          // Manually store user details in Redux
        const userData = {
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: user_name,
        phoneNumber: phone_number,
        address: address,
        photoURL: userCred.user.photoURL,
      };
          storeUserDetailsInRedux(userData);
          navigate("/", { replace: true });
        } else {
          dispatch(alertWarning('Email not verified. Please check your inbox.'));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        }
      } catch (error) {
        console.log("Firebase Auth Error:", error);
        if (error.code === 'auth/invalid-credential') {
          dispatch(alertWarning('Invalid email or password.'));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        } else if (error.code === 'auth/user-not-found') {
          dispatch(alertWarning('No user is found with this email.'));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        } else if (error.code === 'auth/wrong-password') {
          dispatch(alertWarning('Incorrect password.'));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        } else {
          dispatch(alertWarning('An error occurred during sign-in. Please try again.'));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        }
      }
    } else {
      dispatch(alertWarning('Check the password & fill the blanks'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(firebaseAuth, userEmail);
      dispatch(alertSuccess('Password reset email sent. Please check your inbox.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } catch (error) {
      dispatch(alertWarning('Enter your email. and Please try again.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex p-2">
      {/* Background Image */}
      <img
        src={loginbg}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt=""
      />

     {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl text-white bg-black p-2 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={closeLoginPage}
        >
          &times;
        </button>


      {/* Content Box */}
      <div className="flex flex-col md:ml-[30%] items-center bg-cardOverlay w-full md:w-508 h-full z-10 backdrop-blur-sm p-4 px-4 py-8 gap-6 rounded-md">
        {/* Top Logo Section */}
        <div className="flex items-center justify-start gap-4 w-full">
          <img src={Logo} className="w-8" alt="" />
          <p className="text-black font-semibold text-2xl">O'Pizza shop</p>
        </div>

        {/* Welcome Text */}
        <p className="text-3xl font-semibold text-black">Welcome!!</p>
        <p className="text-xl text-black -mt-6">
          {isSignUp ? "Sign up" : "Sign in"} with following
        </p>

        {/* Input Section */}
        <div className="w-full flex flex-col items-center justify-center gap-5 px-4 md:px-10 py-4 -mt-4">
          <LoginInput
            placeHolder={"Email Here"}
            icon={<FaEnvelope className="text-xl text-black" />}
            inputState={userEmail}
            inputStateFunc={setUserEmail}
            type="email"
            isSignUp={isSignUp}
          />

          <LoginInput
            placeHolder={"Password Here"}
            icon={<FaLock className="text-xl text-black" />}
            inputState={password}
            inputStateFunc={setPassword}
            type="password"
            isSignUp={isSignUp}
          />

          {isSignUp && (
            <>
              <LoginInput
                placeHolder={"Confirm Password Here"}
                icon={<FaLock className="text-xl text-black" />}
                inputState={confirm_password}
                inputStateFunc={setConfirm_password}
                type="password"
                isSignUp={isSignUp}
              />
              <LoginInput
                placeHolder={"User Name Here"}
                icon={<FaUser className="text-xl text-black" />}
                inputState={user_name}
                inputStateFunc={setUser_name}
                type="text"
                isSignUp={isSignUp}
              />
              <LoginInput
                placeHolder={"Phone Number Here"}
                icon={<FaPhone className="text-xl text-black" />}
                inputState={phone_number}
                inputStateFunc={setPhone_number}
                type="tel"
                isSignUp={isSignUp}
              />
              <LoginInput
                placeHolder={"Address Here"}
                icon={<FaMapMarkedAlt className="text-xl text-black" />}
                inputState={address}
                inputStateFunc={setAddress}
                type="text"
                isSignUp={isSignUp}
              />
            </>
          )}

          {!isSignUp ? (
            <p>
              Doesn't have an account?{" "}
              <motion.button
                {...buttonClick}
                className="text-indigo-800 underline cursor-pointer bg-transparent"
                onClick={() => setShowPopup(true)}
              >
                Create one
              </motion.button>
            </p>
          ) : (
            <p>
              Already have an account:{" "}
              <motion.button
                {...buttonClick}
                className="text-indigo-800 underline cursor-pointer bg-transparent"
                onClick={() => setIsSignUp(false)}
              >
                Sign in here
              </motion.button>
            </p>
          )}

          {/* Button Section */}
          {isSignUp ? (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 -mt-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              onClick={signUpWithEmailPass}
            >
              Sign Up
            </motion.button>
          ) : (
            <>
              <motion.button
                {...buttonClick}
                onClick={signInWithEmailAndPass}
                className="w-full px-4 py-2 -mt-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              >
                Sign in
              </motion.button>
              <div className="flex justify-center">
                <motion.button
                  {...buttonClick}
                  className='text-sm text-blue-400 hover:text-blue-600 cursor-pointer'
                  onClick={resetPassword}
                >
                  Forgot Password
                </motion.button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-16 -mt-4">
          <div className="w-24 h-[1px] rounded-md bg-black"></div>
          <p className="text-black">or</p>
          <div className="w-24 h-[1px] rounded-md bg-black"></div>
        </div>

        <motion.div
          {...buttonClick}
          className="flex items-center justify-center px-20 py-2 bg-white backdrop-blur-md cursor-pointer rounded-3xl gap-4 -mt-2"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="text-3xl" />
          <p className="capitalize text-base text-black">
            Login with Google
          </p>
        </motion.div>
      </div>

      {/* Sign Up Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 ">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative ">
            <button className="absolute top-4 right-4 text-2xl " onClick={() => setShowPopup(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <LoginInput
              placeHolder={"Email Here"}
              icon={<FaEnvelope className="text-xl text-black" />}
              inputState={userEmail}
              inputStateFunc={setUserEmail}
              type="email"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
              
            />
            
            <LoginInput
              placeHolder={"Password Here"}
              icon={<FaLock className="text-xl text-black" />}
              inputState={password}
              inputStateFunc={setPassword}
              type="password"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
            />
            
            <LoginInput
              placeHolder={"Confirm Password Here"}
              icon={<FaLock className="text-xl text-black" />}
              inputState={confirm_password}
              inputStateFunc={setConfirm_password}
              type="password"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
            />
            
            <LoginInput
              placeHolder={"User Name Here"}
              icon={<FaUser className="text-xl text-black" />}
              inputState={user_name}
              inputStateFunc={setUser_name}
              type="text"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
            />
            
            <LoginInput
              placeHolder={"Phone Number Here"}
              icon={<FaPhone className="text-xl text-black" />}
              inputState={phone_number}
              inputStateFunc={setPhone_number}
              type="tel"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
            />
            
            <LoginInput
              placeHolder={"Address Here"}
              icon={<FaMapMarkedAlt className="text-xl text-black" />}
              inputState={address}
              inputStateFunc={setAddress}
              type="text"
              isSignUp={true}
              className="mt-3" // Add margin-bottom to create a gap
            />
            
            <button onClick={signUpWithEmailPass} className="bg-blue-500 text-white py-2 px-4 rounded mt-4">Sign Up</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
