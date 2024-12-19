import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { PiShoppingCartBold } from "react-icons/pi";
import { Customization, MainLoader, Header, Cart } from '../components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { HashLink } from 'react-router-hash-link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import { setCartOn } from '../context/actions/displaycartAction';
import { alertNULL, alertSuccess } from "../context/actions/alertActions";
import { setCartItems } from "../context/actions/cartAction";
import { addNewItemToCart, getAllCartItems } from "../api";




const Recommended = () => {


  const [selectedItem, setSelectedItem] = useState(null);
  const [modelView, setModelView] = useState(false);
  const navigate = useNavigate();
  const products = useSelector((state) => state.products);
  const isCart = useSelector((state) => state.isCart);
  const user = useSelector((state) => state.user);
  const [recommended, setRecommended] = useState([]);


  const dispatch = useDispatch();

  const sendToCart = async (data) => {
    try {
      dispatch(alertSuccess('Added to the cart'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      await addNewItemToCart(user?.user_id, data);
      const items = await getAllCartItems(user?.user_id);
      dispatch(setCartItems(items));
      dispatch(alertNULL());
      
    
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  useEffect(()=> {
    const recommendedData = products?.filter((data) => data.category === "Pizza items" ||  data.category === "Other items");
    setRecommended(recommendedData);
   }, [products]);

   const handleClose = () => setModelView(false);  

   const handleCustomizeClick = (item) => {
     setSelectedItem(item);
     setModelView(true);
   };

  return (
    <div className='md:mt-24 mt-16'>
        <div className='flex items-center justify-center md:mt-12 mt-6'>
        <p className='md:text-2xl text-xl font-bold capitalize text-black relative bg-white px-16 py-2 rounded-3xl'>
         Recommended
        </p>
    </div>


<div className='flex flex-wrap justify-center items-center md:gap-4 md:mt-8 mt-8'>
    { recommended && recommended.map(item => (
        <div key={item?.id} className='w-[380px] min-w-[310px] md:min-w-[400px] md:w-400 h-225 bg-lightOverlay rounded-3xl backdrop-blur-lg hover:drop-shadow-2xl mb-4 md:mb-8'>
          <div className='w-full flex flex-row items-end px-4 my-4'>
            <motion.img
              src={item?.imageURL}
              className='w-32 h-32 md:w-32 md:ml-4 rounded-lg shadow-xl'
              whileHover={{ scale: 1.1 }}
            />

            <div className='w-full flex flex-col items-center justify-center'>
                          <p className='text-black font-semibold md:text-lg text-sm mt-4 flex flex-col items-end justify-end sm:text-wrap ml-12 md:ml-12'>
                            {item?.name}
                          </p>
                          <div className='flex flex-col items-end justify-end mt-4'>
                            {item?.smallPrice !== 0 && (
                              <p className='text-black font-semibold text-xs'>Starting</p>
                            )}
                            <p className='text-lg text-black font-semibold'>
                              <span className='text-sm text-red-500 px-1'>Rs.</span>
                              {parseFloat(item?.smallPrice ? item?.smallPrice : item?.usualPrice).toFixed(2)}
                            </p>
                          </div>
            </div>     
          </div>

          {item?.smallPrice !== 0 && (
            <div>
              <motion.button type='button' className='text-slate-900 text-base md:ml-8 ml-4 py-2 px-4 hover:text-slate-100 font-semibold hover:bg-orange-600 bg-orange-500 rounded-xl cursor-pointer' whileTap={{ scale: 0.7 }} onClick={() => handleCustomizeClick(item)}>Customize</motion.button>
            </div>
          )}

          {item?.name !== 'Beef Sausages' && item?.usualPrice !== 0 && (
              <motion.button whileTap={{ scale: 0.85 }}
                type='button' onClick={() => {
                  dispatch(setCartOn());
                  sendToCart(item);
                }}
                className='w-[30%] md:ml-8 ml-4 flex items-center justify-center bg-red-600 px-2 py-2 hover:bg-red-700 rounded-2xl md:text-base text-sm text-white font-semibold'>
                Add to
                <PiShoppingCartBold className='ml-2 text-white text-base' />
              </motion.button>
            )}
        </div>      
  ))}

      {selectedItem && (
         <Customization onClose={handleClose} visible={modelView} data={selectedItem} />
        )}

  </div>

      


      <main className='w-screen min-h-screen flex items-center justify-center flex-col '>
        
        {isCart && <Cart />}
      </main>

      
    </div>
 )};


export default Recommended;