import React from "react";
import { DBHome, DBOrders, DBItems, DBNewitems, DBUsers, DBFeedback } from "../components";
import { Route, Routes, Navigate } from "react-router-dom";
import {HiOutlineChevronDoubleDown} from "../assets/icons";
import { buttonClick, SlideInBottom200 } from "../animations";
import { motion } from "framer-motion";

const DBRightSection = ({ onBackClick }) => {
    return (
        <motion.div  {...SlideInBottom200}
         className="md:flex flex-col py-8 px-1 flex-1 h-screen md:w-[78%] w-full bg-primary md:pt-[61px] pt-28">
            <button {...buttonClick} onClick={onBackClick} className="md:hidden p-2 w-12 bg-gray-200 hover:bg-gray-100 rounded-md mb-4 backdrop-blur-md shadow-md">
                <HiOutlineChevronDoubleDown className="text-purple-400 font-bold text-xl hover:text-purple-600 flex items-center justify-center"/>
            </button>
            <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-none">
                <Routes>
                    <Route path="/home" element={<DBHome />} />
                    <Route path="/orders" element={<DBOrders />} />
                    <Route path="/items" element={<DBItems />} />
                    <Route path="/addnewitems" element={<DBNewitems />} />
                    <Route path="/users" element={<DBUsers />} />
                    <Route path="/feedback" element={<DBFeedback />} />
                    <Route path="/" element={<Navigate to="/Dashboard/home" replace />} />
                </Routes>
            </div>
        </motion.div>
    );
};

export default DBRightSection;