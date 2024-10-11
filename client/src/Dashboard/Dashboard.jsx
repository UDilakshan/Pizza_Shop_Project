import React, { useState } from "react";
import { DBHeader, DBLeftSection, DBRightSection } from "../components";

const Dashboard = () => {
    const [showLeft, setShowLeft] = useState(true);

    const handleNavLinkClick = () => {
        setShowLeft(false);
    };

    const handleBackClick = () => {
        setShowLeft(true);
    };

    return (
        <>
        <div className="hidden md:flex w-screen h-screen items-center">
            <DBHeader /> 
            <DBLeftSection onNavLinkClick={handleNavLinkClick} />  
            <DBRightSection />  
        </div>

        <div className="flex md:hidden w-screen h-screen items-center">
            <DBHeader />
            {showLeft ? (
                <DBLeftSection onNavLinkClick={handleNavLinkClick} />
            ) : (
                <DBRightSection onBackClick={handleBackClick} />
            )}
        </div>
        </>
    );
};

export default Dashboard;
