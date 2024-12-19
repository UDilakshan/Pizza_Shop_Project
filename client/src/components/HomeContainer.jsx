import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { PiShoppingCartBold } from "react-icons/pi";
import { Customization, Cart, Banners,Chatbot } from '../components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { HashLink } from 'react-router-hash-link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts,increaseItemQuantity } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import { setCartOn } from '../context/actions/displaycartAction';
import { alertNULL, alertSuccess ,alertDanger} from "../context/actions/alertActions";
import { setCartItems } from "../context/actions/cartAction";
import { addNewItemToCart, getAllCartItems } from "../api";
import { NavLink } from 'react-router-dom';




const HomeContainer = ({isCartOpen }) => {

  const [isFixed, setIsFixed] = useState(false);
  const recommendedRef = useRef(null);  // Reference to the recommended section
  const menuRef = useRef(null);
  const categoryContainerRef = useRef(null); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [width, setWidth] = useState('100%'); // Default width is full (100%)
  const [menuData, setMenuData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [offer, setOffer] = useState([]);
  const [modelView, setModelView] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const sectionsRef = useRef({});
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const products = useSelector((state) => state.products);
  const isCart = useSelector((state) => state.isCart);
  const user = useSelector((state) => state.user); // Ensure user data is available
  const dispatch = useDispatch();
  const cart= useSelector((state)=> state.cart);

  const sendToCart = async (data) => {
    if (!user || !user.user_id) {
      dispatch(alertDanger("Please log in to update the cart"));
      setTimeout(() => {
        dispatch(alertNULL());
        navigate("/login"); // Redirect to login page
      }, 2000);
      return;
    }
    try {
      dispatch(alertSuccess('Added to the cart'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 2000);

         // If the user is logged in and size is selected, proceed with adding the item to the cart
    const item = {   
      productId: data.id,
      product_name: data.name,
      imageURL: data.imageURL,
      usualPrice:data.usualPrice,
      quantity:1,
     
      };
  
    const updatedCart = Array.isArray(cart) ? [...cart, item] : [item];
   
    await addNewItemToCart(user.user_id, data);
    const items = await getAllCartItems(user.user_id);
    dispatch(setCartItems(items));
    dispatch(setCartItems([...cart, item]));
    dispatch(setCartItems(updatedCart));
    
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  useEffect(() => {
  if (activeCategory && categoryContainerRef.current) {
    const categoryElements = Array.from(categoryContainerRef.current.children); // All category items
    const activeIndex = categoryData.findIndex((item) => item.name === activeCategory);

    if (activeIndex !== -1) {
      // Determine the range of categories to display (current + next 2 categories)
      const start = Math.max(activeIndex - 1, 0); // Include the previous category if possible
      const end = Math.min(activeIndex + 2, categoryData.length - 1);

      // Scroll the first category in the range into view
      categoryElements[start]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
}, [activeCategory, categoryData]);

  

  useEffect(() => {
    const handleScroll = () => {
      if (recommendedRef.current && categoryContainerRef.current) {
        // Get the position of the recommended section
        const recommendedOffsetTop = recommendedRef.current.getBoundingClientRect().bottom; // bottom position of the recommended section
        const scrollY = window.scrollY;  // Current scroll position

        // If the scroll position is beyond the bottom of the recommended section, fix the category section
        if (scrollY >= recommendedOffsetTop) {
          setIsFixed(true); // Fix the category section to the top
        } else {
          setIsFixed(false); // Category section returns to normal position
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup scroll event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        console.log('Fetched products:', data); // Log the data to inspect it
        dispatch(setAllProducts(data));
      });
    }
  }, [products, dispatch]);
  

  useEffect(() => {
    const menuData = products?.filter((data) => (data.category !== "OPizza Offers" && data.category !== "Banners" && data.category !== "Pizza items" && data.category !== "Other items" && data.category !== "Category Data"));
    const categoryData = products?.filter((data) => data.category === "Category Data");
    const offersData = products?.filter((data) => data.category === "OPizza Offers");
    const recommendedData = products?.filter((data) => data.category === "Pizza items" ||  data.category === "Other items");
    setRecommended(recommendedData);
    setOffer(offersData);
    setMenuData(menuData);
    setCategoryData(categoryData);
  }, [products]);

  useEffect(() => {
    // Restart autoplay on each re-render
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  }, []);


  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    };
  
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    };
  
    const observer = new IntersectionObserver(observerCallback, options);
  
    // Observe all sections in the menu
    Object.values(sectionsRef.current).forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });
  
    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [menuData]);
  

  const settingsCatagory = {
    infinite: false,
    dots: false,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    speed: 500,
    arrows: true,
    nextArrow: <SampleNextArrowCatagory />,
    prevArrow: <SamplePrevArrowCatagory />,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3, // Show 3 items for mobile screens
          slidesToScroll: 1,
          arrows: false,  // Remove arrows for a better mobile experience
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  

  function SampleNextArrowCatagory(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrowCatagory(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClick}
      />
    );
  }

  const settingsOffers = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    cssEase: "Ease-In-Out",
    nextArrow: <SampleNextArrowOffers />,
    prevArrow: <SamplePrevArrowOffers />,
    responsive: [
      {
        breakpoint: 768,
        settings: { 
          infinite:false,
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay:true,
          autoplaySpeed: 2000,
          afterChange: (current) => {
            // Stop autoplay when the second slide (index 1) is active
            if ((current === 0 || current === 1) && sliderRef.current) {
              sliderRef.current.slickPause();
            }
          }
        }
      },
       
      {
        breakpoint: 640,
        settings: { 
          infinite:false,
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay:true,
          autoplaySpeed: 2000,
          afterChange: (current) => {
            // Stop autoplay when the second slide (index 1) is active
            if ((current === 0 || current === 1) && sliderRef.current) {
              sliderRef.current.slickPause();
            }
          }
        }
      }
    ]
  };


function SampleNextArrowOffers(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems:"center",
        justifyContent:"center",
        background: "rgb(20 83 45)",
        width: "20px",
        height: "20px",
        borderRadius: "10%",
        fontSize: "20px", 
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrowOffers(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems:"center",
        justifyContent:"center",
        background: "rgb(20 83 45)",
        width: "20px",
        height: "20px",
        borderRadius: "10%",
        fontSize: "20px", 
      }}
      onClick={onClick}
    />
  );
} 


  const groupedData = (menuData || []).reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleClose = () => setModelView(false);  

  const handleCustomizeClick = (item) => {
    setSelectedItem(item);
    setModelView(true);
  };

  const scrollWithOffset = (el) => {
    const yOffset = -(categoryContainerRef.current ? categoryContainerRef.current.clientHeight : 0) - 160;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const toggleWidth = () => {
    if (window.innerWidth > 768) { // Check for screen width larger than 768px
      setWidth(prevWidth => (prevWidth === '100%' ? '70%' : '100%'));
    }
  }; 



  return (
    
    <div className='pt-28 backgroundMenu'>

        <Banners /> 
       
       {/* Offers */}
       <div>
        <div className='flex items-center justify-center md:mt-12 mt-6'>
        <p className='md:text-3xl text-xl font-semibold capitalize text-indigo-800 relative  '>
         OPizza Offers
        </p>
      </div>
    <div className='flex flex-row mt-10'>
        <div className='md:w-[92%] md:h-[300px] w-full h-20 mx-auto'>
          <div>  
            <Slider ref={sliderRef} {...settingsOffers}>
              {offer && offer.map((item) => (  
                <motion.div key={item?.productId} className='w-auto flex items-center justify-center'>
                  <HashLink to="#menuSection">
                  <img
                    src={item?.imageURL} 
                    alt="Pizza Images" 
                    className='h-20 max-h-20 w-[90%] mx-auto md:w-full md:h-[300px] md:max-h-[300px] flex items-center justify-center md:px-4 md:py-2 cursor-pointer md:rounded-3xl rounded-md' 
                  />
                  </HashLink>
                </motion.div>
              ))}
            </Slider>
          </div>
        </div>    
      </div>
      </div> 


      {/* <Recommended />  */}  
      <div ref={recommendedRef}  className="recommended-section">
        <div className='md:mt-24 mt-16'>
          <div className='flex items-center justify-center md:mt-12 mt-6'>
          <p className='md:text-3xl text-xl font-semibold capitalize text-indigo-800 relative  '>
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
       </div>

        {selectedItem && (
          <Customization onClose={handleClose} visible={modelView} data={selectedItem} isCartOpen={isCartOpen} />
          )}


         <main className='w-screen min-h-screen flex items-center justify-center flex-col '>
          {isCart && <Cart />}
        </main>  
        </div> 
      </div>


      {/* Category */}
      <div
      ref={categoryContainerRef}
      className={`category-container ${isFixed ? 'fixed-category' : ''}`}
      style={{
        width: isCartOpen ? '70%' : '100%', // Dynamically set width based on isCartOpen
        transition: 'width 0.3s ease-in-out' // Smooth transition
      }}

      >
        <motion.div ref={menuRef} 
          initial={{ opacity: 0, y: 400 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 400 }}
          className='flex items-center justify-center w-full h-auto' 
        >
          <div  className='flex items-center justify-center flex-col w-full'>
            <div className='md:w-[92%] w-full mx-auto md:mt-0 mt-14'>
              <Slider {...settingsCatagory}>
                {categoryData && categoryData.map(item => (
                  <motion.div
                    key={item?.id}
                    className='w-full h-[120px] md:h-28 rounded-b flex flex-col bg-cyan-700 md:px-4 md:py-4 px-2 py-4'
                  >
                    <HashLink smooth to={`#${item?.name}`} scroll={el => scrollWithOffset(el)}>
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        className={`h-[100px] md:-mt-2 md:py-2 -mt-3 max-h-28 md:h-auto flex items-center justify-center flex-col rounded-2xl ${
                          activeCategory === item?.name ? 'bg-orange-500' : 'bg-none'
                        }`}
                      >
                        <div className='w-full h-auto flex items-center justify-center'>
                          <motion.img
                            src={item?.imageURL}
                            alt='image'
                            className='cursor-pointer md:w-[70px] w-14 h-14 rounded-full hover:drop-shadow-xl'
                          />
                        </div>
                        <div className='w-full items-center justify-center flex flex-col'>
                          <p className='text-black text-center font-semibold text-sm md:text-sm'>{item?.name}</p>
                        </div>
                      </motion.div>
                    </HashLink>
                  </motion.div>
                ))}
              </Slider>
            </div>
          </div>
        </motion.div>
      </div>


      {/* Menu */}
      <div id="menuSection" className='flex md:-mt-[620px] -mt-[900px] items-center justify-center'>
        <div className='flex flex-wrap justify-center items-center gap-16'>
        {Object.keys( groupedData).map(category => (
            <div key={category} id={category} ref={el => sectionsRef.current[category] = el} className="w-full mt-16">
              <p className='md:text-[25px] text-xl font-semibold capitalize text-black relative transition-all ease-in-out duration-100 flex justify-center md:ml-24'>
                {category}
              </p>


              <div className='flex flex-wrap justify-center items-center md:gap-4 md:mt-8 mt-8'>
              { groupedData[category].map(item => (
                  <div key={item?.id} className='w-[380px] min-w-[310px] md:min-w-[400px] md:w-400 h-225 bg-lightOverlay rounded-3xl backdrop-blur-lg hover:drop-shadow-2xl mb-4 md:mb-8'>
                    <div className='w-full flex flex-row items-end px-4 my-4'>
                      <motion.img
                        src={item?.imageURL}
                        className='w-32 md:w-32 md:ml-4 rounded-lg shadow-xl'
                        whileHover={{ scale: 1.1 }}
                      />



                      <div className='w-full flex flex-col items-center justify-center'>
                        <p className='text-black font-semibold md:text-base text-sm mt-4 flex flex-col items-end justify-end sm:text-wrap ml-12 md:ml-12'>
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
                        className='w-[30%] md:ml-8 ml-4 flex items-center justify-center bg-red-600 px-2 py-2 hover:bg-red-700 rounded-2xl md:text-base text-sm text-black font-semibold'>
                        Add to
                        <PiShoppingCartBold className='ml-2 text-black text-base' />
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {selectedItem && (
          <Customization onClose={handleClose} visible={modelView} data={selectedItem} isCartOpen={isCartOpen} />
        )}
      </div> 
      <Chatbot />
    </div>
  );
};

export default HomeContainer;