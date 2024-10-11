import React from 'react';
import { buttonClick, staggerFadeInOut } from '../animations';
import { motion } from 'framer-motion';

const OrdersData = ({ index, data, admin }) => {
  const handleClick = (orderId, sts) => {
    console.log(`Order ${orderId} marked as ${sts}`);
  };

  console.log('Order data:', data);

  return (
    <motion.div
      {...staggerFadeInOut(index)}
      className='w-full flex flex-col items-start justify-start px-3 py-2 border relative border-gray-300 bg-lightoverlay drop-shadow-md rounded-md gap-4'
    >
      <div className='w-full flex items-center justify-between'>
        <h1 className='text-xl text-headingColor font-semibold'>Order Details</h1>
        <div className='flex items-center gap-4'>
          <p className='flex items-center gap-1 text-textColor'>
            Total:
            <span className='text-headingColor font-bold'>{data?.total}</span>
          </p>

          <p
            className={`text-base font-semibold capitalized border border-gray-300 px-2 py-[2px] rounded-md ${
              (data.sts === 'Preparing' && 'text-orange-500 bg-orange-100') ||
              (data.sts === 'Cancelled' && 'text-red-500 bg-red-100') ||
              (data.sts === 'Delivered' && 'text-emerald-500 bg-emerald-100')
            }`}
          >
            {data?.sts}
          </p>

          {admin && (
            <div className='flex items-center justify-center gap-2'>
              <p className='text-lg font-semibold text-headingColor'>Mark As</p>

              <motion.p
                {...buttonClick}
                onClick={() => handleClick(data.orderId, 'Preparing')}
                className='text-orange-500 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer'
              >
                Preparing
              </motion.p>

              <motion.p
                {...buttonClick}
                onClick={() => handleClick(data.orderId, 'Cancelled')}
                className='text-red-500 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer'
              >
                Cancelled
              </motion.p>

              <motion.p
                {...buttonClick}
                onClick={() => handleClick(data.orderId, 'Delivered')}
                className='text-green-500 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer'
              >
                Delivered
              </motion.p>
            </div>
          )}
        </div>
      </div>

      
      {data?.carts && data.carts.length > 0 ? (
        data.carts.map((cart, j) => (
          <motion.div
            {...staggerFadeInOut(j)}
            key={j}
            className='flex items-center justify-center gap-1'
          >
            <div className='flex items-start flex-col'>
              <p className='text-base font-semibold text-headingColor'>
              
                {cart.category === 'Desserts' ? cart.name : cart.product_name || 'Unknown Item'}
              </p>
              <div className='flex items-start gap-2'>
                <p className='text-sm text-textColor'>Qty: {cart.quantity}</p>
                <p className='text-sm text-textColor'>Price: {cart.usualPrice}</p>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <p>No items in the cart.</p>
      )}

      {/* Customer Details */}
      <div className='flex items-start justify-start flex-col gap-2 px-6 ml-auto w-full md:w-460'>
        <h1 className='text-lg text-headingColor font-semibold'>{data?.name}</h1>
        <h1 className='text-lg text-headingColor font-semibold'>
          {data?.address}, {data?.address1}, {data?.address2}.
        </h1>
        <h1 className='text-lg text-headingColor font-semibold'>{data?.phone}</h1>
      </div>
    </motion.div>
  );
};

export default OrdersData;