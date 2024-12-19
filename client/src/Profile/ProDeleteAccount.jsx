import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAuth, signInWithEmailAndPassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { alertSuccess, alertWarning, alertNULL } from "../context/actions/alertActions";
import ConfirmationModal from './ConfirmationModal';

const ProDelete = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [reason, setReason] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      setEmail(auth.currentUser.email); 
      // Check if the user signed in with Google
      const providerData = auth.currentUser.providerData;
      setIsGoogleUser(providerData.some((provider) => provider.providerId === 'google.com'));
    }
  }, []);

  const handleDeleteAccount = () => {
    if (email === "" || reason === "") {
      dispatch(alertWarning("Please fill in all fields."));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (!isGoogleUser) {
      if (password === "" || confirmPassword === "") {
        dispatch(alertWarning("Please fill in all required fields."));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        return;
      }

      if (password !== confirmPassword) {
        dispatch(alertWarning("Passwords do not match."));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        return;
      }
    }

    setShowModal(true); // Show confirmation modal if all validations pass
  };

  const confirmDeleteAccount = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!isGoogleUser) {
        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
      }

      if (user) {
        console.log("Reason for deletion:", reason); 
        await deleteUser(user);
        dispatch(alertSuccess("Account deleted successfully."));
        setTimeout(() => {
          dispatch(alertNULL());
          window.location.href = "/login"; 
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting account:", error); 
      if (error.code === 'auth/requires-recent-login') {
        dispatch(alertWarning("Please relogin to continue this action."));
      } else {
        dispatch(alertWarning(`Failed to delete account. Error: ${error.message}`));
      }
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
    setShowModal(false); 
  };

  const cancelDeleteAccount = () => {
    setShowModal(false);
  };

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'start',     
        minHeight: '100vh',       
        margin: '0',              
        padding: '20px 0',        
        boxSizing: 'border-box',  
        backgroundColor: '#f0f0f0', 
      }}
    >
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '600px', 
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
        marginTop: '10px' 
      }}>
        <h1 className="text-2xl font-bold mb-2">Delete Account</h1> 
        <p className="mb-4 text-red-600">
          ⚠️ Deleting your account will remove all your data. This action cannot be undone.
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your email"
            readOnly
          />
        </div>

        {!isGoogleUser && (
          <div className="flex mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your password"
              />
            </div>

            <div className="w-1/2 pl-2">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Confirm your password"
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Reason for Deletion</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Please provide a reason for deleting"
          />
        </div>

        <button
          onClick={handleDeleteAccount}
          className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Account
        </button>
      </div>

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={confirmDeleteAccount}
          onCancel={cancelDeleteAccount}
        />
      )}
    </div>
  );
};

export default ProDelete;
