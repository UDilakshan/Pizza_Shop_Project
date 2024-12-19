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

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
    phoneNumber: '',
    address: '',
  });
  

  useEffect(() => {
    const checkEmailVerification = async () => {
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) {
        try {
          await currentUser.reload();
          if (currentUser.emailVerified) {
            navigate("/", { replace: true });
          } else {
            dispatch(alertWarning('Email is not verified. Please check your email inbox.'));
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          }
        } catch (error) {
          console.error('Error reloading user:', error);
          dispatch(alertWarning('An error occurred while checking email verification status.'));
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
    const addressRegex = /^[a-zA-Z0-9\s,.-]{4,50}$/;


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

      // Reset errors before validation
  setErrorMessages({
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
    phoneNumber: '',
    address: '',
  });

  /*
  if (!password.match(validSymbols)) {
    setErrorMessages((prev) => ({ ...prev, password: "Password can only contain letters, numbers, and @,#,$,%,^,&,*,! symbols" }));
    return;
  }*/


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
          {errorMessages.email && <p className="text-red-500 text-sm">{errorMessages.email}</p>}  {/* Display email error */}


          <LoginInput
            placeHolder={"Password Here"}
            icon={<FaLock className="text-xl text-black" />}
            inputState={password}
            inputStateFunc={setPassword}
            type="password"
            isSignUp={isSignUp}
          />
        {errorMessages.password && <p className="text-red-500 text-sm">{errorMessages.password}</p>}  {/* Display password error */}
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
               {errorMessages.confirmPassword && <p className="text-red-500 text-sm">{errorMessages.confirmPassword}</p>} {/* Display confirm password error */}
              <LoginInput
                placeHolder={"User Name Here"}
                icon={<FaUser className="text-xl text-black" />}
                inputState={user_name}
                inputStateFunc={setUser_name}
                type="text"
                isSignUp={isSignUp}
              />
               {errorMessages.userName && <p className="text-red-500 text-sm">{errorMessages.userName}</p>} {/* Display username error */}
              <LoginInput
                placeHolder={"Phone Number Here"}
                icon={<FaPhone className="text-xl text-black" />}
                inputState={phone_number}
                inputStateFunc={setPhone_number}
                type="tel"
                isSignUp={isSignUp}
              />
               {errorMessages.phoneNumber && <p className="text-red-500 text-sm">{errorMessages.phoneNumber}</p>} {/* Display phone number error */}
              <LoginInput
                placeHolder={"Address Here"}
                icon={<FaMapMarkedAlt className="text-xl text-black" />}
                inputState={address}
                inputStateFunc={setAddress}
                type="text"
                isSignUp={isSignUp}
              />
               {errorMessages.address && <p className="text-red-500 text-sm">{errorMessages.address}</p>} {/* Display address error */}
               </>
           // </>
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
              name="username"
              isSignUp={true}
              className="mt-3" // Add margin-bottom here
             // errorMessage={errorMessages.userName} // Pass the error message to the input
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
              name="address"
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
