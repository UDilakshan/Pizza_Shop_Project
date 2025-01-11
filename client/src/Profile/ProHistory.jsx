import React, { useEffect, useState } from 'react';
import OrdersData from '../components/ordersData'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { getAllOrder } from '../api'; 

const ProHistory = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const auth = getAuth();

    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); 
      } else {
        setUserEmail(null); 
      }
      setLoading(false); 
    });

    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userEmail) {
      setLoading(true); 

      getAllOrder()
        .then((data) => {
          const filteredOrders = data.filter(order => order.email === userEmail);
          setOrders(filteredOrders);
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
        })
        .finally(() => {
          setLoading(false); 
        });
    }
  }, [userEmail]); 

  
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-start px-6 py-4">
        <h1 className="text-2xl font-semibold text-headingColor">My Order History</h1>
        <p>Loading...</p> 
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-start px-6 py-4">
      <h1 className="text-2xl font-semibold text-headingColor">My Order History</h1>

      <div className="w-full flex flex-col gap-4 mt-6">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <OrdersData key={index} index={index} data={order} admin={false} />
          ))
        ) : (
          <p>No orders found for your account.</p>
        )}
      </div>
    </div>
  );
};

export default ProHistory;
