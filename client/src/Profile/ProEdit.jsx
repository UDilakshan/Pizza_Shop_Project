import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaPhone, FaMapMarkedAlt, FaCamera } from "react-icons/fa";
import { updateProfile as updateFirebaseProfile } from "firebase/auth";
import { app } from "../config/firebaseconfig";
import { setUserDetails } from "../context/actions/userActions";
import { alertSuccess, alertWarning, alertNULL } from "../context/actions/alertActions";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const ProEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);  
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [photoURL, setPhotoURL] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  const db = getFirestore(app);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth(app);
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(currentUser.displayName || '');
            setPhoneNumber(userData.phoneNumber || '');
            setAddress(userData.address || '');
            setPhotoURL(userData.photoURL || '');
            setImagePreview(userData.photoURL || '');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [db]);

  const handleSave = async () => {
    if (!phoneNumber || !address) {
      dispatch(alertWarning("Please fill in all fields."));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    try {
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      let updatedPhotoURL = photoURL;

      if (image) {
        updatedPhotoURL = URL.createObjectURL(image);  
      }

      if (currentUser) {
        await updateFirebaseProfile(currentUser, {
          photoURL: updatedPhotoURL,
        });

        await setDoc(doc(db, "users", currentUser.uid), {
          phoneNumber: phoneNumber,
          address: address,
          photoURL: updatedPhotoURL,
        });

        dispatch(setUserDetails({
          ...user,
          phoneNumber: phoneNumber,
          address: address,
          photoURL: updatedPhotoURL,
        }));

        dispatch(alertSuccess("Profile updated successfully."));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);

        setImagePreview(updatedPhotoURL);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      dispatch(alertWarning("Failed to update profile. Please try again."));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setImage(null);
    setImagePreview(photoURL);  
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    if (e.target.value.length !== 10) {
      setPhoneError("Phone number must be 10 digits.");
    } else {
      setPhoneError('');
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (e.target.value.length === 0) {
      setAddressError("Address cannot be empty.");
    } else {
      setAddressError('');
    }
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        overflow: 'hidden',
        maxHeight: '90vh',
        position: 'relative',
      }}>
        
        <div style={{
          marginRight: '20px',
          flexShrink: 0,
          flexBasis: '120px',
          position: 'relative',
        }}>
          <img
            src={imagePreview || 'default-image-url'}
            alt="Profile"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '75px',
              objectFit: 'cover',
              border: '10px solid #fff',
            }}
          />
          {isEditing && (
            <>
              <FaCamera 
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#333',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  padding: '5px',
                }}
                onClick={() => fileInputRef.current.click()}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              {imagePreview && (
                <button 
                  onClick={handleRemovePhoto}
                  style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Remove Photo
                </button>
              )}
            </>
          )}
        </div>

        <div style={{ flexGrow: 1, minWidth: '250px', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
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
    </div>
  );
};

export default ProEdit;