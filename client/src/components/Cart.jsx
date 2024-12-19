import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { motion } from "framer-motion";
import { buttonClick, slideIn } from "../animations";
import { BiChevronRight} from "react-icons/bi";
//import {FcClearFilters} from "react-icons/fc";
import { setCartOff } from "../context/actions/displaycartAction";
import { alertSuccess, alertNULL, alertDanger } from "../context/actions/alertActions";
import { setCartItems } from "../context/actions/cartAction";
import { addNeworder, getAllCartItems,increaseItemQuantity } from "../api/index";
import empty from '../assets/images/OtherImages/empty.png';
import { clearCartItems } from "../context/actions/cartAction";
//import Customization from "./Customization";
import Bill from "./Bill";


const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user); // Get user info
  const [district, setDistrict] = useState("");

  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [name, setName] = useState(user?.name || "");
  const [addressNo, setAddressNo] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState('');
  const [showBill, setShowBill] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
    setCity(''); // Reset city when district changes
  };

  useEffect(() => {
    let tot = 0;
    if (cart) {
      cart.forEach((item) => {
        const price = parseFloat(item.usualPrice ||  item.smallPrice || item.largePrice || item.mediumPrice);
        const quantity = parseInt(item.quantity, 10);
        if (!isNaN(price) && !isNaN(quantity)) {
          tot += price * quantity;
        }
      });
      setTotal(tot);
    }
  }, [cart]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the user is logged in before placing the order
    if (!user || !user.user_id) {
      dispatch(alertDanger("Please log in to place an order"));
      setTimeout(() => {
        dispatch(alertNULL());
        navigate("/login"); // Redirect to login page
      }, 2000);
      return;
    }

    let currentTotal = 0;
    if (cart && cart.length > 0) {
      currentTotal = cart.reduce((acc, item) => {
        const price = parseFloat(item.usualPrice ||  item.smallPrice || item.largePrice || item.mediumPrice);
        const quantity = parseInt(item.quantity, 10);
        return acc + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
      }, 0);
    }

    if (phone.length !== 10) {
      dispatch(alertDanger("Phone number must be exactly 10 digits"));
      setTimeout(() => dispatch(alertNULL()), 3000);
      return; // Prevent form submission if validation fails
    }

    const data = {
      name,
      user_id: user.user_id,
      cart: cart,
      email: user.email,
      addressNo: addressNo,
      address1: address1,
      address2: address2,
      phone: phone,
      total: currentTotal,
    };




    addNeworder(data).then((res) => {
      if (res) {
        dispatch(alertSuccess("Order submitted successfully"));
        setOrderDetails(data); // Save order details
        setShowBill(true);
        dispatch(setCartItems([])); // This will clear the cart
        toggleModal(); // Close the modal after submission
        setTimeout(() => {
          dispatch(alertNULL());
        }, 2000);
        
        setName("");
        setAddressNo("");
        setAddress1("");
        setAddress2("");
        setPhone("");
        setTotal(0);
      
      } else {
        dispatch(alertDanger("Order Failed!"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 2000);
      }
    });
  };


  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhone(value);
    }
  };



  const handleClearCart = async () => {
    if (!user || !user.user_id) {
      dispatch(alertDanger("Please log in to clear the cart"));
      setTimeout(() => dispatch(alertNULL()), 2000);
      return;
    }
  
    try {
      const success = await clearCartItems(user.user_id);
      if (success) {
        dispatch(setCartItems([])); // Clear the cart in Redux
        dispatch(alertSuccess("Cart cleared successfully"));
      } else {
        dispatch(alertDanger("Failed to clear the cart"));
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      dispatch(alertDanger("Failed to clear the cart"));
    } finally {
      setTimeout(() => dispatch(alertNULL()), 2000);
    }
  };
  

  return (
    <motion.div
      {...slideIn}
      className="fixed z-50 top-24 right-0 w-full md:w-[375px] bg-gradient-to-r from-purple-300 to-blue-200 backdrop-blur-lg shadow-2xl h-[calc(100vh-6rem)]  p-6 rounded-l-xl"
    >

       
    

      <div className="w-full flex items-center justify-between py-6 border-b border-gray-300">
        <motion.i
          {...buttonClick}
          className="cursor-pointer"
          onClick={() => dispatch(setCartOff())}
        >
          <BiChevronRight className="text-[40px] text-white" />
        </motion.i>
        <p className="text-2xl text-white font-bold">Your Card</p>
       {/* <motion.i
          {...buttonClick}
          className="cursor-pointer"
          onClick={handleClearCart}
        
        >
          <div className="flex items-center justify-center w-18 h-12 bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg rounded-full hover:shadow-2xl hover:from-red-600 hover:to-orange-500 transition-all duration-300 ease-in-out cursor-pointer">
           <FcClearFilters className="text-[32px] text-white" /> clear
           </div>


        </motion.i>*/}
      </div>




      <div className="w-full h-full  items-center justify-center">
        {cart && cart .length > 0 ? (
          <>
            <div className="flex flex-col w-full items-start justify-start gap-3 h-[80%] overflow-y-auto ">
              { cart.map((item , i) => (
                < CartItemCard  key={i} index={i} data={item} />
              ))} 


    

    <div className="w-full flex flex-col items-center justify-between   border-gray-200 bg-gradient-to-r from-purple-300 to-blue-200 ">
    <div className="w-full flex items-center justify-between text-black font-bold">
      <p className="text-l">Total</p>
      <p className="text-l">Rs {total}/=</p>
    </div>


    
    <button
    className="w-[70%] py-1  text-lg font-semibold text-slate-900 hover:text-white bg-blue-800 hover:bg-blue-600 rounded-xl transition-all duration-200 ease-in-out"
    onClick={toggleModal}
            >
          Place Order
    </button>
    </div>
    </div>

          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center ">
            <img
              src={empty}
              className="w-40 h-40 rounded-full object-contain"
              alt="Empty Cart"
            />
            <p className="text-l text-gray-700 font-semibold">Your card is empty</p>
            <p className="text-l text-gray-700 font-semibold">Continue purchasing!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-[500px] w-full">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your name"
                  required
                  disabled={district !== "Jaffna"}  // Disable the input if not Jaffna
                />
              </div>


             <div className="mb-4">
    <label className="block text-gray-700 text-sm">District</label>
    <select
      value={district}
      onChange={handleDistrictChange}
      className="w-full p-2.5 border rounded-sm"
      required
    >
      <option value="">Select District</option>
      <option value="Jaffna">Jaffna</option>
      <option value="Colombo">Colombo</option>
      <option value="Kandy">Kandy</option>
    </select>
  </div>

  {district === "Jaffna" && (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm">City</label>
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full p-2.5 border rounded-sm"
        required
      >
        <option value="">Select City</option>
        <option value="Nallur">Nallur</option>
        <option value="Chavakachcheri">Chavakachcheri</option>
      </select>
    </div>
  )}

  {(district === "Colombo" || district === "Kandy") && (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm">City</label>
      <input
        type="text"
        value="City not available"
        readOnly
        className="w-full p-2.5 border rounded-sm bg-gray-200 text-gray-500"
      />
    </div>
  )}

  <div className="mb-4">
    <label className="block text-gray-700 text-sm">Address</label>
    <input
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      className="w-full p-2.5 border rounded-sm"
      placeholder="Enter your address"
      required
      disabled={district !== "Jaffna"}
    />
  </div>

  <div className="mb-4">
        <label className="block text-gray-700 text-sm">Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={handlePhoneChange}
          className="w-full p-2.5 border rounded-sm"
          placeholder="Enter your phone number"
          required
          disabled={district !== "Jaffna"}
        />
        {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
      </div>

  {district && district !== "Jaffna" && (
    <p className="text-red-500 text-sm mt-2">
      We currently only deliver to Jaffna. We hope to expand soon!
    </p>
  )}

  <div className="mt-4">
    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 px-3 rounded-sm"
      disabled={district !== "Jaffna"}
    >
      Submit Order
    </button>
  </div>
            </form>
          </div>
        </div>
      )}


{showBill && (
  <Bill
    orderDetails={orderDetails}
    onClose={() => setShowBill(false)}
  />
)}


    </motion.div>
  );
};





// Updated CartItemCard with user and navigate defined inside the component
export const CartItemCard = ({ index, data }) => {
  const user = useSelector((state) => state.user); // Fetch user here
  const cart = useSelector((state)=>state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add navigate here
  const [itemTotal, setItemTotal] = useState(0);
 

  useEffect(() => {
    const price = parseFloat(data.usualPrice ||  data.smallPrice || data.largePrice || data.mediumPrice)|| 0; // Handle undefined values
    const quantity = parseInt(data.quantity, 10) || 0;
    const total = price * quantity  ;
    setItemTotal(total); 
  }, [data.usualPrice ||  data.smallPrice || data.largePrice || data.mediumPrice, data.quantity]);
  

  const decrementCard = (productId) => {
    // Check if the user is logged in before updating the cart
    if (!user || !user.user_id) {
      dispatch(alertDanger("Please log in to update the cart"));
      setTimeout(() => {
        dispatch(alertNULL());
        navigate("/login"); // Redirect to login page
      }, 2000);
      return;
    }

    dispatch(alertSuccess("Updated the cart item"));
    setTimeout(() => {
      dispatch(alertNULL());
    }, 2000);
   
    increaseItemQuantity(user?.user_id, productId, "decrement")
      .then(() => {
        return getAllCartItems(user?.user_id); // Ensure it returns the items
      })   
      .then((items) => {
        if (items) {
          // Dispatch updated cart to the Redux store
          
          dispatch(setCartItems(items));
        } else{
          throw new Error("Failed to fetch updated items");
        }
      })
      .catch((error) => {
        console.error("Error updating cart item:", error);
        dispatch(alertDanger("Failed to update cart!"));
      })
      .finally(() => {
        dispatch(alertNULL());
      });
  };





  const incrementCard = (productId) => {
    if (!user || !user.user_id) {
      dispatch(alertDanger("Please log in to update the cart"));
      setTimeout(() => {
        dispatch(alertNULL());
        navigate("/login");
      }, 2000);
      return;
    }

    dispatch(alertSuccess("Updated the cart item"));
    setTimeout(() => {
      dispatch(alertNULL());
    }, 3000);
  








    increaseItemQuantity(user?.user_id, productId, "increment")
      .then(() => {
        return getAllCartItems(user?.user_id); // Ensure it returns the items
      })
      .then((items) => {
        if (items) {
          // Dispatch updated cart to the Redux store
          dispatch(setCartItems(items));
        } else{
          throw new Error("Failed to fetch updated items");
        }
      })
      .catch((error) => {
        console.error("Error updating cart item:", error);
        dispatch(alertDanger("Failed to update cart!"));
      })
      .finally(() => {
        dispatch(alertNULL());
      });
  };





  return (
    <motion.div
      key={index }
      className="w-full flex items-center justify-between bg-gray-100 rounded-md drop-shadow-md p-4 gap-4"
    >
      <img
        src={data?.imageURL}
        className="w-24 h-24 object-contain rounded-lg border border-gray-200"
        alt=""
      />
      <div className="flex items-center justify-start gap-1 w-full">
        
          <p className="text-sm text-black-800 font-semibold">
            {data.name }

           <span className="text-sm block capitalize text-black-800">
              {data.catagory}
            </span>

            <span className=" text-sm  font-semibold text-blue-500">
               Rs. {itemTotal}/=
            </span>
           
            
            {data.size && (
            <span className="text-sm block capitalize text-red-800">
              Size: {data.size}
            </span>
          )}
          {data.totalPrice && (
            <span className="text-sm block capitalize text-red-800">
               {data.totalPrice}
            </span>
          )}
          {data.cheeseAdded && (
            <span className="text-sm block capitalize text-green-800">
             Extra Cheese 
            </span>
          )}
        
         
          
           </p>
      </div>

      <div className="ml-auto flex items-center justify-center gap-3">
        <motion.div
          {...buttonClick}
          onClick={() => decrementCard(data?.productId)}
          className="w-6 h-6 flex items-center justify-center rounded-md drop-shadow-md bg-red-600 text-white cursor-pointer"
        >
          <p className="text-xl font-semibold">-</p>
        </motion.div>
        <p className="text-lg text-gray-800 font-semibold">{data?.quantity}</p>
        <motion.div
          {...buttonClick}
          onClick={() => incrementCard(data?.productId)}
          className="w-6 h-6 flex items-center justify-center rounded-md drop-shadow-md bg-green-600 text-white cursor-pointer"
        >
          <p className="text-xl font-semibold">+</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
 
