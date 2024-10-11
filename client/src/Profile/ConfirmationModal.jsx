import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1000', 
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)', 
        }}
      >
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>{message}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: 'gray',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;