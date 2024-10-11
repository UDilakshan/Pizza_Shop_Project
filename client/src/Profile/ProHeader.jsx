import React from "react";
import { useSelector } from "react-redux";

const ProHeader = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="w-full flex items-center justify-between gap-3 p-4 bg-white shadow-md">
      <div>
        <p className="text-2xl text-headingColor">
          Hi,
          {user?.name && (
            <span className="text-xl text-cyan-800">{` ${user?.name}...!`}</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProHeader;
