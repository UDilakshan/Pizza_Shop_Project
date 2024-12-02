import React, { useState } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import {useDispatch, useSelector} from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router';
import { GiFullPizza } from "react-icons/gi";
import { PiShoppingCartBold } from "react-icons/pi";
import { alertSuccess, alertNULL,alertDanger } from "../context/actions/alertActions";
import { setCartItems, updateProductPrice } from "../context/actions/cartAction";
import { setCartOn } from '../context/actions/displaycartAction';
import { addNewItemToCart, getAllCartItems } from "../api";
import axios from 'axios';
 
const Customization = ({ visible, onClose, data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  const [price, setPrice] = useState("0.00");
  const [selectedSize, setSelectedSize] = useState(null);
  const [optionView, setOptionView] = useState(false);
  const [cheeseShow, setCheeseShow] = useState(false);
  const [cheeseAdded, setCheeseAdded] = useState(false);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const [cartVisible, setCartVisible] = useState(false);
  
  const resetState = () => {
    setPrice("0.00");
    setSelectedSize(null);
    setCheeseShow(false);
    setCheeseAdded(false);
    setTotalPrice("0.00");
  };

  const handleClose = (e) => {
    if (e.target.id === 'outOfBorder') {
      resetState();
      onClose();}
  };


  let cheese = "100.00";

  const updateTotalPrice = (basePrice) => {
    const extraCheeseCost = cheeseAdded ? parseFloat(cheese) : 0;
    setTotalPrice((parseFloat(basePrice) + extraCheeseCost).toFixed(2));
  };

  


  const handleSizeClick = (e, newSize, newPrice) => { 
    if (selectedSize === newSize) {
      resetState();
    } else {
      setSelectedSize(newSize);
      setPrice(newPrice);
      updateTotalPrice(newPrice);
      setCheeseShow(true);
    }
  };

  const handlePrice = () => {
    if (cheeseAdded) {
      setTotalPrice((parseFloat(totalPrice) - parseFloat(cheese)).toFixed(2));
    } else {
      setTotalPrice((parseFloat(totalPrice) + parseFloat(cheese)).toFixed(2));
    }
    setCheeseAdded(!cheeseAdded);
  };
 
  /*const handleAddToCart = async (data) => {
    if (!user || !user.user_id) {
      dispatch(alertSuccess("Please log in to add items to the cart"));
      setTimeout(() => {
        dispatch(alertNULL());
        navigate('/login');
      }, 2000);
      return;
    }

    if (!selectedSize) {
      dispatch(alertSuccess("Please select a size before adding to cart"));
      setTimeout(() => dispatch(alertNULL()), 2000);
      return;
    }

    /*const newItem = {
      productId: data.id,
      product_name: data.name,
      imageURL: data.imageURL,
      usualPrice: price,
      quantity: 1,
      size: selectedSize,
      cheeseAdded,
    };*

    try {
      // Add the new item to the backend
      await addNewItemToCart(user.user_id, newItem);

      // Fetch the updated cart
      //const updatedCart = await getAllCartItems(user.user_id);
      const updatedCart = Array.isArray(cart) ? [...cart, newItem] : [newItem];
    
    await addNewItemToCart(user.user_id, data);
    const items = await getAllCartItems(user.user_id);
    dispatch(setCartItems(data));
    //dispatch(setCartItems(updatedCart));
    
     if (updatedCart) {
        dispatch(setCartItems(updatedCart));
        dispatch(updateProductPrice({ productId: data.id, newPrice: totalPrice }));
        dispatch(alertSuccess("Item added to cart"));
      } else {
        throw new Error("Failed to fetch updated cart items");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      dispatch(alertDanger("Failed to add item to cart"));
    } finally {
      setTimeout(() => dispatch(alertNULL()), 3000);
      resetState();
      onClose();
    }
  };
 */
  const handleAddToCart =  async (data) => { 
    // Check if the user is logged in
    if (!user || !user.user_id) {
      // If not logged in, show an alert and redirect to the login page
      dispatch(alertSuccess("Please log in to add items to the cart"));
      setTimeout(() => {
        dispatch(alertNULL());
        navigate('/login'); // Redirect to login page
      }, 2000);
      return; // Prevent further execution
    }
  
    // Check if a size is selected
    if (!selectedSize) {
      // Show an alert if no size is selected
      dispatch(alertSuccess("Please select a size before adding to cart"));
      setTimeout(() => dispatch(alertNULL()), 2000);
      return; // Prevent adding to cart if size is not selected
    }
  
    // If the user is logged in and size is selected, proceed with adding the item to the cart
    const item = {
      productId: data.id,
      product_name: data.name,
      imageURL: data.imageURL,
      smallPrice: data.smallPrice,
      mediumPrice: data.mediumPrice,
      largePrice: data.largePrice,
      usualPrice:price,
      quantity:1,
      size: selectedSize,
      cheeseAdded:cheeseAdded,
      totalPrice:totalPrice,
      };
  
    const updatedCart = Array.isArray(cart) ? [...cart, item] : [item];
    
    await addNewItemToCart(user.user_id, data);
    const items = await getAllCartItems(user.user_id);
    dispatch(setCartItems(items));
    dispatch(setCartItems([...cart, item]));
    
   // dispatch(setCartItems(updatedCart));
    dispatch(alertSuccess("Item added to cart"));
    setTimeout(() => {
      dispatch(alertNULL());
    }, 2000);

   
    resetState();
    onClose();
  }

  if (!visible) return ;
  return (
    <div onClick={handleClose} id='outOfBorder' className='fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center'>
      <div className="bg-white p-4 rounded-lg relative w-[90%] md:w-[60%] border border-gray-300 md:h-[70%] h-[80%] mt-5">
        <div>
          <button onClick={onClose} className='absolute top-0 right-0 m-2'>
            <IoIosCloseCircle className='text-2xl' />
          </button>
        </div>

        <div className='absoulute mt-8 w-full h-[90%]'>
          {/* Desktop */}
          <div className='flex flex-row gap-1'>  
                <div className='hidden border rounded border-gray-400 p-2 md:flex flex-col gap-2 w-[50%] h-[75%]'>
                  <div className='w-full flex items-center justify-center p-2'>
                    <img src={data?.imageURL} alt="image" className='w-[65%] h-[65%] object-cover rounded-xl' />
                  </div> 
                  <div className='w-full h-full flex items-center justify-center mb-3'>
                    <p className='flex items-center justify-center text-pink-600'>{data?.description}</p>
                  </div>
                </div>

                  <div className='hidden md:flex w-[50%] h-[90%]'>
                    <div className='border rounded border-gray-400 w-full h-auto flex flex-col gap-4 p-2'>
                      <motion.div className='ml-1 flex items-center justify-start' onClick={() => setOptionView(!optionView)}
                        initial={{ opacity: 0, x: 200 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 200 }}
                        whileTap={{ scale: 0.95 }}>
                        <p className='text-black text-lg border-2 bg-orange-100 border-orange-600 rounded-xl p-1 w-full flex items-center justify-center'>Select size here...</p>
                      </motion.div>
                      {optionView && (
                        <>
                          <motion.div className='flex flex-col gap-2 border-1 border-dotted border-gray-300'
                            initial={{ opacity: 0, y: 200 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: 200 }} >

                            <motion.div whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-2 pb-2 border-dotted border-b-2 border-gray-300 cursor-pointer ${selectedSize === "small" ? 'text-orange-500 bg-white' : ' hover:text-slate-900'}`}
                              onClick={(e) => handleSizeClick(e, "small", parseFloat(data?.smallPrice).toFixed(2))}>
                              <GiFullPizza className='text-xl' />
                              <p className='text-lg'>small</p>
                              <p className='flex items-center justify-center ml-auto text-lg'>{selectedSize === "small" ? price : parseFloat(data?.smallPrice).toFixed(2)}</p>
                            </motion.div>

                            <motion.div whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-2 pb-2 border-dotted border-b-2 border-gray-300 cursor-pointer ${selectedSize === "medium" ? 'text-orange-500 bg-white' : ' hover:text-slate-900'}`}
                              onClick={(e) => handleSizeClick(e, "medium",parseFloat(data?.mediumPrice).toFixed(2))}>
                              <GiFullPizza className='text-2xl' />
                              <p className='text-lg '>medium</p>
                              <p className='flex items-center justify-center ml-auto text-lg'>{selectedSize === "medium" ? price : parseFloat(data?.mediumPrice).toFixed(2)}</p>
                            </motion.div>

                            <motion.div whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-2 cursor-pointer ${selectedSize === "large" ? 'text-orange-500 bg-white' : ' hover:text-slate-900'}`}
                              onClick={(e) => handleSizeClick(e, "large", parseFloat(data?.largePrice).toFixed(2))}>
                              <GiFullPizza className=' text-3xl' />
                              <p className='text-lg flex'>large</p>
                              <p className='flex items-center justify-center ml-auto text-lg'>{selectedSize === "large" ? price : parseFloat(data?.largePrice).toFixed(2)}</p>
                            </motion.div>

                          </motion.div>

                          {selectedSize && (
                            <div className='flex item-center justify-center w-full mt-4 bg-yellow-200 rounded-xl'>
                              <input type="checkbox" checked={cheeseAdded} onChange={handlePrice} name="Extra cheese" value="Extra cheese" className='ml-2' />
                              <p className='text-black w-full flex items-center justify-start py-2 ml-1'>Extra cheese</p>
                              <p className='text-blackflex items-center justify-center py-2 mr-2'>{cheese}</p>
                            </div>
                          )}

                        </>
                       )}
                      <div className='flex items-center justify-center w-full gap-2'>
                        <motion.button whileTap={{ scale: 0.85 }}
                          type='button'
                          onClick={() => {
                            dispatch(setCartOn())
                            handleAddToCart(data); } }
                          className='w-[40%] flex items-center justify-center bg-pink-600 px-2 py-2 hover:bg-pink-900 rounded-2xl text-base text-white font-semibold'>
                          Add to
                          <PiShoppingCartBold className='ml-2 text-white text-base' />
                        </motion.button>
                        <p className='w-[40%] px-2 py-1 drop-shadow-lg flex items-center justify-center text-xl font-semibold bg-green-400 rounded-lg'>
                          {totalPrice !== '0.00' ? totalPrice : "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
          </div>


          {/* Mobile */}
          <div className='flex flex-col border rounded border-gray-400'>  
                <div className='md:hidden p-2 flex flex-col gap-2 w-full h-[75%]'>
                  <div className='w-full flex items-center justify-center p-2'>
                    <img src={data?.imageURL} alt="image" className='w-[65%] h-[65%] object-cover rounded-xl' />
                  </div>
                  <div className='w-full h-full flex items-center justify-center'>
                    <p className='flex items-center justify-center text-black text-lg font-semibold'>{data?.name}</p>
                  </div>
                   <div className='w-full h-full flex items-center justify-center mb-3'>
                    <p className='flex items-center justify-center text-pink-600 text-sm'>{data?.description}</p>
                  </div>
                </div>

                  <div className='md:hidden flex w-full h-[90%]'>
                    <div className=' h-auto w-full flex flex-col gap-4 p-2'>
                      <motion.div className='ml-1 flex items-center justify-start' onClick={() => setOptionView(!optionView)}
                        initial={{ opacity: 0, x: 200 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 200 }}
                        whileTap={{ scale: 0.95 }}>
                        <p className='text-black text-lg border-2 bg-orange-100 border-orange-600 rounded-xl p-1 w-full flex items-center justify-center'>Select size here...</p>
                      </motion.div>
                      {optionView && (
                        <>
                          <motion.div className='flex flex-col gap-2 border-1 border-dotted border-gray-300'
                            initial={{ opacity: 0, y: 200 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: 200 }} >

                            <motion.div whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-2 pb-2 border-dotted border-b-2 border-gray-300 cursor-pointer ${selectedSize === "small" ? 'text-orange-500 bg-white' : ' hover:text-slate-900'}`}
                              onClick={(e) => handleSizeClick(e, "small", parseFloat(data?.smallPrice).toFixed(2) )}>
                              <GiFullPizza className='text-xl' />
                              <p className='text-lg'>small</p>
                              <p className='flex items-center justify-center ml-auto text-lg'>{selectedSize === "small" ? price : parseFloat(data?.smallPrice).toFixed(2)}</p>
                            </motion.div>

                            <motion.div whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-2 pb-2 border-dotted border-b-2 border-gray-300 cursor-pointer ${selectedSize === "medium" ? 'text-orange-500 bg-white' : ' hover:text-slate-900'}`}
                              onClick={(e) => handleSizeClick(e, "medium", parseFloat(data?.mediumPrice).toFixed(2))}>
                              <GiFullPizza className='text-2xl' />
                              <p className='text-lg '>medium</p>
                              <p className='flex items-center justify-center ml-auto text-lg'>{selectedSize === "medium" ? price : parseFloat(data?.mediumPrice).toFixed(2)}</p>
                            </motion.div>

                            <motion.div whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-2 cursor-pointer ${selectedSize === "large" ? 'text-orange-500 bg-white' : ' hover:text-slate-900'}`}
                              onClick={(e) => handleSizeClick(e, "large", parseFloat(data?.largePrice).toFixed(2))}>
                              <GiFullPizza className=' text-3xl' />
                              <p className='text-lg flex'>large</p>
                              <p className='flex items-center justify-center ml-auto text-lg'>{selectedSize === "large" ? price : parseFloat(data?.largePrice).toFixed(2)}</p>
                            </motion.div>

                          </motion.div>

                          {selectedSize && (
                            <div className='flex item-center justify-center w-full mt-4 bg-yellow-200 rounded-xl'>
                              <input type="checkbox" checked={cheeseAdded} onChange={handlePrice} name="Extra cheese" value="Extra cheese" className='ml-2' />
                              <p className='text-black w-full flex items-center justify-start py-2 ml-1'>Extra cheese</p>
                              <p className='text-blackflex items-center justify-center py-2 mr-2'>{cheese}</p>
                            </div>
                          )}

                        </>
                      )}
                      <div className='flex items-center justify-center w-full gap-2'>
                        <motion.button whileTap={{ scale: 0.85 }}
                          type='button'
                            onClick={() => {
                            dispatch(setCartOn())
                            handleAddToCart(data);
                             } }
                          className='w-[40%] flex items-center justify-center bg-pink-600 px-2 py-2 hover:bg-pink-900 rounded-2xl text-base text-white font-semibold'>
                          Add to
                          <PiShoppingCartBold className='ml-2 text-white text-base' />
                        </motion.button>
                        <p className='w-[40%] px-2 py-1 drop-shadow-lg flex items-center justify-center text-xl font-semibold bg-green-400 rounded-lg'>
                          {totalPrice !== '0.00' ? totalPrice : "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
             </div>
        </div> 
      </div>
    </div>
  );
}


export default Customization;

