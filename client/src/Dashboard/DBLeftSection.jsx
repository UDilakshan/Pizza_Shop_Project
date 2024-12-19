import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { isActiveStyles, isNotActiveStyles } from "../utils/style";
import { SlideInTop200 } from "../animations";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';



const DBLeftSection = ({ onNavLinkClick }) => {

    const navigate = useNavigate();  // This should be inside the component function

    const handleClick = () => {
      navigate('/developer-details'); // Navigate to the DeveloperDetails page
    };
    return (
    <motion.div {...SlideInTop200} className="h-full flex flex-col shadow-sm md:min-w-210 md:w-300 w-full gap-3 bg-gray-100 backdrop-blur-lg">
      <hr className="my-2 border-t-2 border-gray-300" />
      <ul className="flex flex-col gap-3 md:pt-16 pt-24">
         <NavLink to="/Dashboard/home" className={({ isActive }) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-pink-600` : isNotActiveStyles} onClick={onNavLinkClick}>Home</NavLink>
         <NavLink to="/Dashboard/orders" className={({ isActive }) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-pink-600` : isNotActiveStyles} onClick={onNavLinkClick}>Orders</NavLink>
         <NavLink to="/Dashboard/items" className={({ isActive }) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-pink-600` : isNotActiveStyles} onClick={onNavLinkClick}>Items</NavLink>
         <NavLink to="/Dashboard/addnewitems" className={({ isActive }) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-pink-600` : isNotActiveStyles} onClick={ onNavLinkClick }>Add new item</NavLink>
         <NavLink to="/Dashboard/users" className={({ isActive }) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-pink-600` : isNotActiveStyles} onClick={onNavLinkClick}>Users</NavLink>
         <NavLink to="/Dashboard/feedback" className={({ isActive }) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-pink-600` : isNotActiveStyles} onClick={onNavLinkClick}>Feedback</NavLink>
      </ul>
      <div className="w-full items-center justify-center flex h-225 mt-auto px-2 pb-2">
        <div className="w-full h-full rounded-md bg-gray-800 flex items-center justify-center flex-col gap-3 px-3">
            <div className="w-12 h-12 borde bg-white rounded-full flex items-center justify-center mt-2">
                <p className="text-2xl font-bold text-black">?</p>
            </div> 
                <p className="text-xl text-primary font-semibold">Help Center</p>
                <p className="text-base text-gray-300 text-center">
                    Having trouble in O'Pizza, Please contact us for more questions
                </p>
                <p className="px-4 py-2 rounded-full bg-primary text-black cursor-pointer mb-2"
                    onClick={handleClick}
                >
                   Click here
               </p>
        </div>
      </div>
    </motion.div>
    );
};

export default DBLeftSection;
