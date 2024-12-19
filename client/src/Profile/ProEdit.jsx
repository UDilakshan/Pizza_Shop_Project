import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaPhone, FaMapMarkedAlt } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../config/firebaseconfig";
import { setUserDetails } from "../context/actions/userActions";
import { alertSuccess, alertWarning, alertNULL } from "../context/actions/alertActions";

const ProEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(currentUser.displayName || '');
            setPhoneNumber(userData.phoneNumber || '');
            setAddress(userData.address || '');

            // Dispatch updated data to Redux
            dispatch(setUserDetails({
              displayName: currentUser.displayName || '',
              phoneNumber: userData.phoneNumber || '',
              address: userData.address || '',
            }));
          } else {
            // Set empty fields if no data found in Firestore
            setUserName(currentUser.displayName || '');
            setPhoneNumber('');
            setAddress('');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Fetch data on load or if essential fields are missing
    if (!user?.displayName || !user?.phoneNumber || !user?.address) {
      fetchUserData();
    } else {
      // Ensure all fields show correctly on page load
      setUserName(user.displayName || '');
      setPhoneNumber(user.phoneNumber || '');
      setAddress(user.address || '');
    }
  }, [db, dispatch, user]);

  const handleSave = async () => {
    if (!phoneNumber || !address) {
      dispatch(alertWarning("Please fill in all fields."));
      setTimeout(() => dispatch(alertNULL()), 3000);
      return;
    }

    try {
      const auth = getAuth(app);
      const currentUser = auth.currentUser;

      if (currentUser) {
        await setDoc(doc(db, "users", currentUser.uid), {
          phoneNumber,
          address,
        });

        dispatch(setUserDetails({
          ...user,
          displayName: userName,
          phoneNumber,
          address,
        }));

        dispatch(alertSuccess("Profile updated successfully."));
        setTimeout(() => dispatch(alertNULL()), 3000);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      dispatch(alertWarning("Failed to update profile. Please try again."));
      setTimeout(() => dispatch(alertNULL()), 3000);
    }
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setPhoneError(e.target.value.length !== 10 ? "Phone number must be 10 digits." : '');
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setAddressError(e.target.value.length === 0 ? "Address cannot be empty." : '');
  };

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: '0',
        padding: '0',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
      }}
    >
      <div style={{
        backgroundColor: 'white',
        width: '90%',
        maxWidth: '700px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}>
        
        <h1 className="text-2xl font-bold mb-4">Profile Details</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">User Name</label>
          <div className="flex items-center border border-gray-300 rounded">
            <input
              type="text"
              value={userName}
              readOnly
              className="w-full p-2 border-none outline-none bg-gray-200 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <div className="flex items-center border border-gray-300 rounded">
            <FaPhone className="text-gray-500 ml-2" />
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="w-full p-2 border-none outline-none"
              disabled={!isEditing}
            />
          </div>
          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Address</label>
          <div className="flex items-center border border-gray-300 rounded">
            <FaMapMarkedAlt className="text-gray-500 ml-2" />
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              className="w-full p-2 border-none outline-none"
              disabled={!isEditing}
            />
          </div>
          {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
        </div>

        {isEditing ? (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProEdit;
