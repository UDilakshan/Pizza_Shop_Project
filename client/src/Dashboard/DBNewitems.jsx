import React, { useState, useEffect } from "react";
import { MdFastfood, MdCloudUpload, MdDelete, MdAttachMoney, MdOutlineDescription } from 'react-icons/md';
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, RecPlace } from "../components";
import { storage } from '../firebase.config';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { alertDanger, alertSuccess, alertNULL, alertWarning } from "../context/actions/alertActions";
import { setAllProducts } from "../context/actions/productActions";
import { buttonClick } from "../animations";
import { addNewProduct, getAllProducts } from "../api";

const DBNewItems = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(null);
  const [usualPrice, setUsualPrice] = useState("");
  const [mediumPrice, setMediumPrice] = useState("");
  const [smallPrice, setSmallPrice] = useState("");
  const [largePrice, setLargePrice] = useState("");
  const [isPriceValid, setIsPriceValid] = useState(true);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);
  const [progress, setProgress] = useState(10);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const alert = useSelector(state => state.alert);
  const dispatch = useDispatch();


  useEffect(() => {
    if (selectedOption) {
      setCategory(selectedOption);
    }
  }, [selectedOption]);


  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}_${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on('state_changed',
      (snapshot) => {
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      (error) => {
        dispatch(alertDanger(`Error: ${error}`));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        setIsLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          setImageDownloadURL(downloadURL);
          setIsLoading(false);
          dispatch(alertSuccess("Image uploaded successfully"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        });
      }
    );
  };

  const deleteImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageDownloadURL);
    deleteObject(deleteRef).then(() => {
      setImageDownloadURL(null);
      setIsLoading(false);
      dispatch(alertSuccess("Image deleted successfully"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    });
  };

  const handlePriceChange = (e, setPrice) => {
    const inputValue = e.target.value;
    const isValidFloat = /^\d*\,?\d*\.?\d*$/.test(inputValue);

    if (isValidFloat || inputValue === "") {
      setPrice(inputValue);
      setIsPriceValid(true);
    } else {
      setIsPriceValid(false);
    }
  };

  const saveDetails = () => {
    try {
           if (!imageDownloadURL) {
            dispatch(alertWarning("Required fields can not be empty"));
           setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
      
        else {
        const data = {
          name: itemName,
          imageURL: imageDownloadURL,
          category: category,
          usualPrice: usualPrice > 0 ? usualPrice : 0.00,
          smallPrice: smallPrice > 0 ? smallPrice : 0.00,
          mediumPrice: mediumPrice > 0 ? mediumPrice : 0.00,
          largePrice: largePrice > 0 ? largePrice : 0.00,
          description: description,
        };

        addNewProduct(data).then(res => {
          dispatch(alertSuccess("Image added to the database successfully"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        });

        setCategory(null);
        setItemName("");
        setImageDownloadURL(null);
        setUsualPrice("");
        setSmallPrice("");
        setMediumPrice("");
        setLargePrice("");
        setDescription("");
      }

      getAllProducts().then(data => {
        dispatch(setAllProducts(data));
      });
    } catch (err) {
      dispatch(alertDanger("Error while uploading: Try again"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  const handleOnClose = () => {
    setPopupVisible(false);
  };

  const handleClick = () =>{
    setPopupVisible(true);
  }

  const statuses = [
    { id: 1, title: "Category Data", category: "Category Data" },
    { id: 2, title: "OPizza Offers", category: "OPizza Offers" },
    { id: 3, title: "Recommended", category: "Recommended" },
    { id: 4, title: "Premium Non Veg", category: "Premium Non Veg" },
    { id: 5, title: "Starters", category: "Starters" },
    { id: 6, title: "Non Veg Pizza", category: "Non Veg Pizza" },
    { id: 7, title: "Veg Pizza", category: "Veg Pizza" },
    { id: 8, title: "Desserts", category: "Desserts" },
    { id: 9, title: "Drinks", category: "Drinks" },
    { id: 10, title: "Banners", category: "Banners" },
  ];

  const usualPriceCategories = ["Starters", "Drinks", "Desserts", "OPizza Offers", "Other items"];
  const sizePriceCategories = ["Veg Pizza", "Non Veg Pizza", "Premium Non Veg", "Pizza items"];
  const noPriceCategories = ["Banners", "Category Data"];

  return (
    <div className="flex items-center justify-center pt-8 flex-col p-4 w-full">
      <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4">
        {
          category !== "Banners" && (
            <div className='w-full py-2 border-b border-gray-300 flex items-center gap-3'>
            <MdFastfood className='text-xl text-black'/>
            <input
              type='text'
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder='Type the name of the food...'
              className='w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400'
            />
          </div>
          )
        }
     


        {/* Category */}

        <p className="w-full text-left text-lg font-semibold flex items-center justify-center">Select Category</p>
        <div className="w-full flex items-start justify-around gap-3 flex-wrap border-b border-gray-300 pb-4">
          {statuses && statuses.map((data) => (
            <p
              key={data.id}
              onClick={() => {
                if (data.category === "Recommended") {
                  handleClick();  
                }

                else {
                  setCategory(data.category);
                }
              }}
              
              className={`px-2 py-1 rounded-md text-sm font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md ${
                data.category === category || (data.category === "Recommended" && (category ==="Other items" || category === "Pizza items")) ? 'bg-pink-500 text-white' : 'bg-transparent text-textColor'
              }`}
            >
              {data.title}
            </p>
          ))}
        </div>

        {
        popupVisible && (
          <RecPlace
            onClose={handleOnClose}
            visible={popupVisible}
            onSelect={(option) => setSelectedOption(option)}
          />
          
        )}

        <div className='w-full flex flex-col md:flex-row items-center gap-3'>
          {usualPriceCategories.includes(category) && (
            <div className='w-full py-2 border-b border-gray-300 flex items-center gap-2'>
              <MdAttachMoney className='text-2xl text-gray-800' />
              <input
                type='text'
                required
                value={usualPrice}
                onChange={(e) => handlePriceChange(e, setUsualPrice)}
                placeholder="Usual Price"
                className={`w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 ${
                  !isPriceValid ? "border-red-500" : ""
                }`}
              />
            </div>
          )}

          {sizePriceCategories.includes(category) && (
            <>
              <div className='w-full py-2 border-b border-gray-300 flex items-center gap-2'>
                <MdAttachMoney className='text-2xl text-gray-800' />
                <input
                  type='text'
                  required
                  value={smallPrice}
                  onChange={(e) => handlePriceChange(e, setSmallPrice)}
                  placeholder="Price of small"
                  className={`w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 ${
                    !isPriceValid ? "border-red-500" : ""
                  }`}
                />
              </div>

              <div className='w-full py-2 border-b border-gray-300 flex items-center gap-2'>
                <MdAttachMoney className='text-2xl text-gray-800' />
                <input
                  type='text'
                  required
                  value={mediumPrice}
                  onChange={(e) => handlePriceChange(e, setMediumPrice)}
                  placeholder="Price of medium"
                  className={`w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 ${
                    !isPriceValid ? "border-red-500" : ""
                  }`}
                />
              </div>

              <div className='w-full py-2 border-b border-gray-300 flex items-center gap-2'>
                <MdAttachMoney className='text-2xl text-gray-800' />
                <input
                  type='text'
                  required
                  value={largePrice}
                  onChange={(e) => handlePriceChange(e, setLargePrice)}
                  placeholder="Price of large"
                  className={`w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 ${
                    !isPriceValid ? "border-red-500" : ""
                  }`}
                />
              </div>
            </>
          )}
        </div>
        

        {
          !noPriceCategories.includes(category) && (
          <div className='w-full py-2 border-b border-gray-300 flex items-center gap-2'>
            <MdOutlineDescription className='text-xl text-gray-800' />
            <input
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Give a description...'
              className='w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400'
            />
          </div>
          )}

        <div className='w-full bg-card backdrop-blur-md md:h-370 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-evenly px-24">
              <Spinner />
              {Math.round(progress) > 0 && (
                <div className="w-[30%] flex flex-col items-center justify-center gap-2">
                  <div className="flex justify-between w-full">
                    <span className="text-base font-medium text-textColor">Progress</span>
                    <span className="text-sm font-medium text-textColor">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-pink-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${Math.round(progress)}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {!imageDownloadURL ? (
                <label>
                  <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                    <MdCloudUpload className='text-gray-500 text-3xl hover:text-gray-700'/>
                    <p className='text-gray-500 hover:text-gray-700'>Click here to upload</p>
                  </div>
                  <input
                    type='file'
                    name='upload-image'
                    accept='image/*'
                    onChange={uploadImage}
                    className='w-0 h-0'
                  />
                </label>
              ) : (
                <div className="relative h-full">
                  <img
                    src={imageDownloadURL}
                    alt='uploaded image'
                    className="w-full h-full object-cover"
                  />
                  <button
                    type='button'
                    className='absolute bottom-3 right-3 p-3 rounded-full bg-pink-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out'
                    onClick={deleteImage}
                  >
                    <MdDelete className='text-white'/>
                  </button>
                </div>
              )}
            </>
          )}
        </div>


        {/* Save button */}

        <div className='flex items-center w-full'>
          <motion.button {...buttonClick}
            type='button'
            className='ml-0 md:ml-auto w-full md:w-[25%] border-none outline-none
             bg-pink-600 px-12 py-2 hover:bg-pink-900 rounded-2xl text-lg text-white font-semibold'
            onClick={saveDetails}> Save
          </motion.button>
        </div> 
      </div>
    </div>
  );
};

export const InputValueField = (type, placeHolder, stateValue, stateFunc) => {
  return (
    <input
      type={type}
      placeholder={placeHolder}
      className="w-full px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
      value={stateValue}
      onChange={(e) => stateFunc(e.target.value)}
    />
  );
};

export default DBNewItems;
