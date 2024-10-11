import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInOut } from "../animations";

const LoginInput = ({ placeHolder, icon, inputState, inputStateFunc, type, className = "", isSignUp }) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false); 
  const [isEmailValid, setIsEmailValid] = useState(false); 
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  //const value = inputState;
  
  const handleInputChange = (event) => {
    const { value } = event.target;

    // Allow only numeric input for phone number field and limit to 10 digits
    if (type === 'tel') {
      const numericValue = value.replace(/[^0-9]/g, ''); // Filter out non-numeric characters

       // Only update state if the numeric value length is less than or equal to 10
      if (numericValue.length <= 10) {
        inputStateFunc(numericValue); // Update state
      }

      // Validate to ensure it's exactly 10 digits long
      if (numericValue.length === 10) {
        setIsPhoneValid(true); // Set phone valid state to true
      } else {
        setIsPhoneValid(false); // Set to false if not valid
      }
    } 

    else if (type === 'email') {
    // const validEmail =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
     //const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
     const validEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|email\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

     // Allow all input first
    if (value.includes('(') || value.includes(')') || value.includes('`') || value.includes('=') || value.includes('/')) {
      setIsEmailValid(false); // Set to false if brackets or backticks are present
      return; // Prevent further processing
  }

      inputStateFunc(value); // Allow all input first
      
      if (validEmail.test(value)) {
        setIsEmailValid(true); // Set email valid state to true
      } else {
        setIsEmailValid(false); // Set to false if not valid
      }
    }

    else if (type === 'password') {
      // Allow only numeric input for password and enforce exactly 10 digits
      const numericValue = value.replace(/[^0-9]/g, ''); // Filter out non-numeric characters
      if (numericValue.length <= 6) {
        inputStateFunc(numericValue); // Update state only if length is <= 10
    
        // Validate to ensure it's exactly 10 characters long
        if (numericValue.length === 6) {
          setIsPasswordValid(true); // Set password valid state to true
        } else {
          setIsPasswordValid(false); // Set to false if not valid
        }
      }
    }
   

    else if (type === 'text' && isSignUp) {
      const validAddress = /^[a-zA-Z0-9\s,.]{0,50}$/;
     // const validAddress = /^(?=.{4,50}$)[a-zA-Z0-9\s,.]*$/;

      // Allow any characters, but will validate length separately
      if (validAddress.test(value) ){
      inputStateFunc(value); // Update state regardless of validity
      }
      // Validate address length
      if (value.length >= 4 && value.length <= 50) {
        setIsAddressValid(true); // Set address valid state to true
      } else {
        setIsAddressValid(false); // Set to false if not valid
      }
    }
     // Handle other input types normally
     else {
      inputStateFunc(value);
    }
  };

    //else if (type === 'text' && isSignUp) {
      {/*Length between 3 and 15 characters.
      Can include letters, numbers, hyphens, and underscores.
      Cannot start or end with a hyphen or underscore.
      Cannot have consecutive hyphens or underscores.*/}
     // const validUsername = /^(?![-_])([a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*){3,15}(?<![-_])$/;
      /*const validUsername =/^[a-zA-Z0-9\s,.]{0,15}$/;

        if (validUsername.test(value)) {
          inputStateFunc(value);
        } 
        if (value.length >= 3 && value.length <= 15){
          setIsUsernameValid(true);
        } else {
          setIsUsernameValid(false); // Set to false if not valid
        }
    }
     // else if (type === 'text' && isSignUp) {
          // Updated regex to enforce rules: letters, numbers, hyphens, underscores, and length between 3 and 15
         // else if (type === 'text' && isSignUp) {
          //else if (type === 'text' && isSignUp) {
            /*const validUsername = /^(?![-_])([a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*)$/;
          
            // Check if the input value length exceeds 15
            if (value.length > 15) {
              // Set invalid state and prevent further input
              setIsUsernameValid(false);
              return; // Stop further processing
            }
          
            // Check if the input value matches the regex and is at least 3 characters long
            if (validUsername.test(value) && value.length >= 3) {
              inputStateFunc(value); // Update state with valid username
              setIsUsernameValid(true); // Set valid state
            } else {
              setIsUsernameValid(false); // Set to false if not valid
            }
          }
          */
          
   

  return (
    <motion.div
      {...fadeInOut}
      className={`flex items-center justify-start gap-4 bg-white backdrop-blur-md rounded-md w-full px-4 py-2 border ${
        isFocus 
          ? (isEmailValid && type === 'email' ? "border-green-600 border-2" : 
            (isPasswordValid && type === 'password' ? "border-green-600 border-2" : 
            (isPhoneValid && type === 'tel' ? "border-green-600 border-2" : 
            (isAddressValid && type === 'text' && isSignUp ? "border-green-600 border-2" : 
            (isUsernameValid && type === 'text' && isSignUp ? "border-green-600 border-2" : 
             "shadow-md shadow-black border-blue-600")) )))
          : "border-gray-300"
      } ${className}`} // Apply dynamic styles and additional classes
    >
      {icon}
      <input
        type={type}
        placeholder={placeHolder}
        value={inputState}
        onChange={handleInputChange} // Use the single change handler
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        className="w-full h-full bg-transparent text-black text-lg font-semibold border-none outline-none"
      />
    </motion.div>
  );
};

export default LoginInput;
