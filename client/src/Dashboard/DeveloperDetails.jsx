import React from "react";

const DeveloperDetails = () => {
  const developers = [
    {
      name: "Uthayakumar Dilakshan",
      contactNo: "0771925633",
      email: "uthayakumardilakshan@gmail.com",
    },
    {
      name: "Pravika Ravi",
      contactNo: "0743078892",
      email: "iampravika@gmail.com",
    },
    {
      name: "Varsha Thayananthan",
      contactNo: "0765782282",
      email: "varshala28@gmail.com",
    },
    {
      name: "Nilusana Gobalakrishnar",
      contactNo: "0764246918",
      email: "nilusana07gobalakrishnar@gmail.com",
    },
    {
      name: "A.K Pruthuvi Theekshana",
      contactNo: "0725266387",
      email: "pruthuvitheekshana07@gmail.com",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mt-24 mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Developer Details
      </h1>
      <div className="space-y-6">
        {developers.map((developer, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 shadow-md"
          >
            <p className="text-lg font-semibold">
              {index + 1}. {developer.name}
            </p>
            <p className="text-gray-700">Contact: {developer.contactNo}</p>
            <p className="text-gray-700">Email: {developer.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperDetails;
