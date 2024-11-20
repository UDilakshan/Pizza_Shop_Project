import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../api";
import { setAllProducts } from "../context/actions/productActions";
import { CChart } from "@coreui/react-chartjs"
import firebase from 'firebase/app';
import { useState } from 'react';
import {collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseconfig'

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
      <div className='grid w-full grid-cols-1 md:grid-cols-2 gap-4 h-full'>
        <div className='flex items-center justify-center gap-8 ml-4'>
          <div className='w-full md:w-2/3 lg:w-1/2 mb-6'>
            <CChart
              type="bar"
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

          <div className='w-full md:w-2/3 lg:w-1/2'>
            <CChart
              type="doughnut"
              data={{
                labels: ['Orders', 'Cancellend', 'Delivered' ],
                datasets: [
                  {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                    data: orderData,
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;