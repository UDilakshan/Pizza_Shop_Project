import React from 'react';
import { IoIosCloseCircle } from "react-icons/io";

const RecPlace = ({ visible, onClose, onSelect }) => {
    const handleOnClose = () => {
        onClose();
    };

    const handleOptionClick = (option) => {
        onSelect(option);
        handleOnClose();
    };

    if (!visible) return null;

    return (
        <div 
            onClick={handleOnClose} 
            className='fixed z-50 inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center ease-in-out duration-100'
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                className='bg-white p-4 rounded-md md:w-[40%] w-[90%] relative mb-40'
            >
                <button 
                    onClick={onClose} 
                    className='absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-900'
                >
                    <IoIosCloseCircle />
                </button>

                <p className='flex items-center justify-center p-2 text-xl font-semibold'>You want to add this as a</p>
                <div className='flex justify-around mt-4'>
                    <button 
                        onClick={() => handleOptionClick('Pizza items')}
                        className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700'
                    >
                        Pizza items
                    </button>
                    <button 
                        onClick={() => handleOptionClick('Other items')}
                        className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700'
                    >
                        Other items
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecPlace;
