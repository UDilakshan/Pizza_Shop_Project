
import React from 'react';
import { useSelector } from 'react-redux';

const ProfileComponent = () => {
  const user = useSelector((state) => state.user);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <img
        src={user.photoURL || 'default-image-url'}
        alt="Profile"
        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
      />
      <h1>{user.displayName || 'User Name'}</h1>
      <p>{user.phoneNumber || 'Phone Number'}</p>
      <p>{user.address || 'Address'}</p>
    </div>
  );
};

export default ProfileComponent;
