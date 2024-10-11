import React from 'react';
import { useSelector } from 'react-redux';

const ConfirmationPage = () => {
  const customerDetails = useSelector((state) => state.customer.customerDetails);

  return (
    <div>
      <h2>Order Confirmation</h2>
      <p><strong>Name:</strong> {customerDetails.name}</p>
      <p><strong>Address:</strong> {customerDetails.address}</p>
      <p><strong>Phone:</strong> {customerDetails.phone}</p>
      {/* Other confirmation details */}
    </div>
  );
};

export default ConfirmationPage;
