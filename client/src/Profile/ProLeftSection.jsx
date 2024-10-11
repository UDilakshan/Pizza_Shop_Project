import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {isProfStyles,isNotProfStyles} from "../utils/style";



const ProLeftSection = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/Home");
    };

    return (
        <div className="flex flex-col w-[22%] h-full bg-gray-200 pt-32">
    
          <ul className="flex flex-col gap-4">

            <NavLink to = {"/Profile/history"} className={({ isActive }) => isActive ? `${isProfStyles} px-4 py-2 border-l-8 border-white` : isNotProfStyles}>My Orders</NavLink>
            <NavLink to = {"/Profile/feedback"} className={({ isActive }) => isActive ? `${isProfStyles} px-4 py-2 border-l-8 border-white` : isNotProfStyles}>Feedbacks</NavLink>
            <NavLink to = {"/Profile/edit"} className={({ isActive }) => isActive ? `${isProfStyles} px-4 py-2 border-l-8 border-white` : isNotProfStyles}>Edit Profile</NavLink>
            <NavLink to = {"/Profile/deleteaccount"} className={({ isActive }) => isActive ? `${isProfStyles} px-4 py-2 border-l-8 border-white` : isNotProfStyles}>Delete Account</NavLink>
         
          </ul>
        </div>
    );
};

export default ProLeftSection;
