import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInOut } from "../animations";

const LoginInput = ({placeHolder,icon,inputState, inputStateFunc,type,className = "",isSignUp}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <motion.div
      {...fadeInOut}
      className={`flex items-center justify-start gap-4 bg-white backdrop-blur-md rounded-md w-full px-4 py-2 border ${
        isFocus ? "shadow-md shadow-black border-blue-500" : "border-gray-300"
      } ${className}`} // Apply dynamic styles and additional classes
    >
      {icon}
      <input
        type={type}
        placeholder={placeHolder}
        className="w-full h-full bg-transparent text-black  text-lg font-semibold border-none outline-none"
        value={inputState}
        onChange={(e) => inputStateFunc(e.target.value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </motion.div>
  );
};

export default LoginInput;