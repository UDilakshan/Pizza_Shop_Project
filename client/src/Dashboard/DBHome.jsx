import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../api";
import { setAllProducts } from "../context/actions/productActions";
import { CChart } from "@coreui/react-chartjs";
import firebase from 'firebase/app';
import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState([0, 0, 0]); // Default data [preparing, cancelled, delivered]

  const drinks = products?.filter((item) => item.category === "Drinks");
  const non_veg_pizza = products?.filter((item) => item.category === "Non Veg Pizza");
  const starters = products?.filter((item) => item.category === "Starters");
  const dessert = products?.filter((item) => item.category === "Dessert");
  const premium_non_veg = products?.filter((item) => item.category === "Premium Non Veg");

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
  }, [products, dispatch]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orderCollection = collection(db, 'orders');
      const orderSnapshot = await getDocs(orderCollection);
      let preparingCount = 0;
      let cancelledCount = 0;
      let deliveredCount = 0;

      orderSnapshot.forEach((doc) => {
        const data = doc.data();
        switch (data.sts) {
          case 'preparing':
            preparingCount++;
            break;
          case 'Cancelled':
            cancelledCount++;
            break;
          case 'Delivered':
            deliveredCount++;
            break;
          default:
            break;
        }
      });

      setOrderData([preparingCount, cancelledCount, deliveredCount]);
    };

    fetchOrders();
  }, []);

  return (
    <div className='flex items-center justify-center flex-col pt-6 w-full h-full'>
      <div className='flex w-full flex-wrap items-center justify-between gap-4'>
        {/* Bar Chart */}
        <div className='flex-1 flex items-center justify-center'>
          <CChart
            type="bar"
            style={{ width: '90%', height: '400px' }} // Adjust width and height
            data={{
              labels: ["drinks", "non_veg_pizza", "starters", "dessert", "premium_non_veg"],
              datasets: [
                {
                  label: 'Category wise count',
                  backgroundColor: '#f87979',
                  data: [drinks?.length, non_veg_pizza?.length, starters?.length, dessert?.length, premium_non_veg?.length],
                },
              ],
            }}
            labels="months"
          />
        </div>

        {/* Doughnut Chart */}
        <div className='flex-1 flex items-center justify-center'>
          <CChart
            type="doughnut"
            style={{ width: '70%', height: '400px' }} // Adjust width and height
            data={{
              labels: ['Preparing', 'Cancelled', 'Delivered'],
              datasets: [
                {
                  backgroundColor: ['	#41B883', '#E46651', '#0096FF'],
                  data: orderData,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DBHome;
