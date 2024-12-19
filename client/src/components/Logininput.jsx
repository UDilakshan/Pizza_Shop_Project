import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInOut } from "../animations";

const LoginInput = ({
  placeHolder,
  icon,
  inputState,
  inputStateFunc,
  type,
  name,
  className = "",
  isSignUp = false,
 // isSignUp = false, // Only show validation messages for sign-up
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);  // Track if user interacted with the field

  const handleInputChange = (event) => {
    const { value } = event.target;
    setHasInteracted(value !== ""); // Mark as interacted when field is not empty

    if (type === "tel") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) inputStateFunc(numericValue);
      setIsPhoneValid(numericValue.length === 10);
      setErrorMessage(numericValue.length === 10 ? "" : "Phone number must be 10 digits.");
    } else if (type === "email") {
      const validEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|email\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      inputStateFunc(value);
      setIsEmailValid(validEmail.test(value) && !/[()`=/]/.test(value));
      setErrorMessage(validEmail.test(value) ? "" : "Please enter a valid email address.");
    } else if (type === "password") {
      const validPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      inputStateFunc(value);
      setIsPasswordValid(validPassword.test(value));
      setErrorMessage(validPassword.test(value) ? "" : "Password must be at least 6 characters, with at least one letter and one number.");
    } else if (type === "text") {
      // Handle address and username fields only if `isSignUp` is true
      if (isSignUp) {
        if (name === "address") {
          const validAddress = /^[a-zA-Z0-9\s,.]{4,50}$/;
          inputStateFunc(value); // Always update the input state
          setIsAddressValid(validAddress.test(value));
          setErrorMessage(validAddress.test(value) ? "" : "Address must be between 4 and 50 characters.");
        }
  
        if (name === "username") {
          const validUsername = /^[a-zA-Z0-9_]{3,15}$/;
          inputStateFunc(value); // Always update the input state
          setIsUsernameValid(validUsername.test(value));
          setErrorMessage(validUsername.test(value) ? "" : "Username must be 3-15 characters and contain only letters, numbers, and underscores.");
        }
      }
    }  else {
      inputStateFunc(value);
      setErrorMessage("");
    }
  };

  return (
    <div>
      <motion.div
        {...fadeInOut}
        className={`flex items-center justify-start gap-4 bg-white rounded-md w-full px-4 py-2 border 
          ${
            isFocus
              ? (isEmailValid && type === "email") ||
                (isPasswordValid && type === "password") ||
                (isPhoneValid && type === "tel") ||
                (isAddressValid && type === "text" && name === "address") ||
               (isUsernameValid && type === "text" && name === "username")
                ? "border-green-600 border-2"
                : "border-blue-500 shadow-md shadow-black"
              : "border-gray-300"
          } ${className}`}
        style={{ minHeight: "40px", minWidth: "380px" }}
      >
        {icon}
        <input
          type={type}
          placeholder={placeHolder}
          value={inputState}
          onChange={handleInputChange}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          className="w-full bg-transparent text-black text-lg font-semibold border-none outline-none"
          style={{ padding: "0px 6px" }}
        />
      </motion.div>

      {/* Error message display */}
       {/* Show error message only if user has interacted with the field */}
       {isSignUp && hasInteracted && errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default LoginInput;
