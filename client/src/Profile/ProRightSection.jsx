import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ProDeleteAccount, ProEdit, ProFeedback, ProHistory } from "../components"; 

const ProRightSection = () => {
    return (
        <div className="flex flex-col py-8 px-12 h-full w-[78%] bg-secondary">
            <div className="flex flex-col overflow-y-scroll scrollbar-none mt-4 pt-14">
                <Routes>
                    <Route path="/history" element={<ProHistory />} />
                    <Route path="/feedback" element={<ProFeedback />} />
                    <Route path="/edit" element={<ProEdit />} />
                    <Route path="/deleteaccount" element={<ProDeleteAccount />} />
                    <Route path="/" element={<Navigate to="/Profile/history" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default ProRightSection;
