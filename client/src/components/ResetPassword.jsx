import React, { useState } from 'react';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { alertSuccess, alertWarning, alertNULL } from '../context/actions/alertActions';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmnewPassword, setConfirmnewPassword] = useState('');
  const dispatch = useDispatch();

  const handlePasswordReset = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const oobCode = queryParams.get('oobCode'); // Get the code from URL

    // Check if the passwords match
    if (newPassword !== confirmnewPassword) {
      dispatch(alertWarning('Passwords do not match.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    // Validate password strength (optional)
    if (newPassword.length < 6) {
      dispatch(alertWarning('Password should be at least 6 characters long.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, newPassword);
      dispatch(alertSuccess('Password has been successfully reset.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } catch (error) {
      dispatch(alertWarning('An error occurred while resetting your password. Please try again.'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <input
        type="password"
        id="new-password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        id="confirm-password"
        placeholder="Confirm New Password"
        value={confirmnewPassword}
        onChange={(e) => setConfirmnewPassword(e.target.value)}
      />
      <button onClick={handlePasswordReset}>  Forgot Password</button>
    </div>
  );
};

export default ResetPassword;
