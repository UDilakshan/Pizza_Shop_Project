import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { motion } from "framer-motion";
import { buttonClick, slideIn } from "../animations";
import { BiChevronRight } from "react-icons/bi";
import { setCartOff } from "../context/actions/displaycartAction";
import { alertSuccess, alertNULL, alertDanger } from "../context/actions/alertActions";
import { setCartItems } from "../context/actions/cartAction";
import { addNeworder, getAllCartItems,increaseItemQuantity } from "../api/index";
import empty from '../assets/images/OtherImages/empty.jpg';
import Customization from "./Customization";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user); // Get user info
  
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [name, setName] = useState(user?.name || "");
  const [addressNo, setAddressNo] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let tot = 0;
    if (cart) {
      cart.forEach((item) => {
        const price = parseFloat(item.usualPrice);
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
        const price = parseFloat(item.usualPrice);
        const quantity = parseInt(item.quantity, 10);
        return acc + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
      }, 0);
    }

    const data = {
      name: name,
      user_id: user.user_id,
      cart: cart,
      email: user.email,
      addressNo: addressNo,
      address1: address1,
      address2: address2,
      phone: phone,
      total: currentTotal,
    };

    // Send the order to the server
    addNeworder(data).then((res) => {
      if (res) {
        dispatch(alertSuccess("Order submitted successfully"));

        // Reset form inputs and total
        setName("");
        setAddressNo("");
        setAddress1("");
        setAddress2("");
        setPhone("");
        setTotal(0);

        // Reset cart to empty
        dispatch(setCartItems([])); // This will clear the cart

        toggleModal(); // Close the modal after submission

        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } else {
        dispatch(alertDanger("Order Failed!"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
    });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhone(value);
    }
  };

  return (
    <motion.div
      {...slideIn}
      className="fixed z-50 top-24 right-0 w-full md:w-[400px] bg-gradient-to-r from-purple-600 to-blue-500 backdrop-blur-lg shadow-2xl h-screen p-6 rounded-l-xl"
    >
      <div className="w-full flex items-center justify-between py-4 border-b border-gray-300">
        <motion.i
          {...buttonClick}
          className="cursor-pointer"
          onClick={() => dispatch(setCartOff())}
        >
          <BiChevronRight className="text-[40px] text-white" />
        </motion.i>
        <p className="text-2xl text-white font-bold">Your Cart</p>
      </div>

      <div className="flex-1 flex flex-col items-start justify-start bg-white h-full py-6 gap-3 overflow-y-auto rounded-t-xl">
        {cart && cart.length > 0 ? (
          <>
            <div className="flex flex-col w-full items-start justify-start gap-3 h-[60%] overflow-y-scroll px-4">
              {cart.map((item, i) => (
                <CartItemCard key={i} index={i} data={item} />
              ))}
            </div>

            <div className="w-full flex flex-col items-center justify-between px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-purple-600 to-blue-500 rounded-b-xl">
              <div className="w-full flex items-center justify-between text-white font-bold">
                <p className="text-xl">Total</p>
                <p className="text-xl">Rs {total}/=</p>
              </div>

              <button
                className="mt-4 w-full py-3 text-lg font-semibold text-slate-900 hover:text-white bg-blue-800 hover:bg-blue-600 rounded-xl transition-all duration-200 ease-in-out"
                onClick={toggleModal}
              >
                Place Order
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            <img
              src={empty}
              className="w-40 h-40 rounded-full object-contain"
              alt="Empty Cart"
            />
            <p className="text-xl text-gray-700 font-semibold">Your cart is empty</p>
            <p className="text-xl text-gray-700 font-semibold">Continue purchasing!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-[400px] w-full">
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
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address No</label>
                <input
                  type="text"
                  name="addressNo"
                  value={addressNo}
                  onChange={(e) => setAddressNo(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address 1</label>
                <input
                  type="text"
                  name="address1"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address 2</label>
                <input
                  type="text"
                  name="address2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Enter your phone number"
                />
                {phone.length > 0 && phone.length < 10 && (
                  <p className="text-red-500 text-sm">Phone number must be 10 digits long.</p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="mr-4 bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Updated CartItemCard with user and navigate defined inside the component
export const CartItemCard = ({ index, data }) => {
  const user = useSelector((state) => state.user); // Fetch user here
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add navigate here
  const [itemTotal, setItemTotal] = useState(0);

  useEffect(() => {
    const price = parseFloat(data.usualPrice) || 0;
    const quantity = parseInt(data.quantity, 10) || 0;
    setItemTotal(price * quantity);
  }, [data.usualPrice, data.quantity]);

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
    }, 3000);

    increaseItemQuantity(user?.user_id, productId, "decrement")
      .then(() => getAllCartItems(user?.user_id))
      .then((items) => {
        dispatch(setCartItems(items));
        dispatch(alertNULL());
      })
      .catch((error) => {
        console.error("Failed to update cart item:", error);
        dispatch(alertNULL());
      });
  };

  const incrementCard = (productId) => {
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
    }, 3000);

    increaseItemQuantity(user?.user_id, productId, "increment")
      .then(() => getAllCartItems(user?.user_id))
      .then((items) => {
        dispatch(setCartItems(items));
        dispatch(alertNULL());
      })
      .catch((error) => {
        console.error("Failed to update cart item:", error);
        dispatch(alertNULL());
      });
  };

  return (
    <motion.div
      key={index}
      className="w-full flex items-center justify-between bg-gray-100 rounded-md drop-shadow-md p-4 gap-4"
    >
      <img
        src={data?.imageURL}
        className="w-24 h-24 object-contain rounded-lg border border-gray-200"
        alt=""
      />
      <div className="flex items-center justify-start gap-1 w-full">
        <div>
          <p className="text-lg text-gray-800 font-semibold">
            {data?.product_name}
            <span className="text-sm block capitalize text-gray-500">
              {data.product_category}
            </span>
          </p>
          <p className="text-sm flex items-center justify-center gap-1 font-semibold text-green-500">
            Rs {itemTotal}/=
          </p>
          {data.size && (
            <span className="text-sm block capitalize text-gray-500">
              Size: {data.size}
            </span>
          )}
          {data.cheeseAdded && (
            <span className="text-sm block capitalize text-gray-500">
              Extra Cheese
            </span>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center justify-center gap-3">
        <motion.div
          {...buttonClick}
          onClick={() => decrementCard(data?.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-red-600 text-white cursor-pointer"
        >
          <p className="text-xl font-semibold">-</p>
        </motion.div>
        <p className="text-lg text-gray-800 font-semibold">{data?.quantity}</p>
        <motion.div
          {...buttonClick}
          onClick={() => incrementCard(data?.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-green-600 text-white cursor-pointer"
        >
          <p className="text-xl font-semibold">+</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;

 