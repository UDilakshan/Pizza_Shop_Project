import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { PiShoppingCartBold } from "react-icons/pi";
import { Customization, Header, Cart } from '../components';
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

const FullMenuContainer = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [modelView, setModelView] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const sectionsRef = useRef({});
  const categoryContainerRef = useRef(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const products = useSelector((state) => state.products);
  const isCart = useSelector((state) => state.isCart);
  const user = useSelector((state) => state.user); // Ensure user data is available

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
    setMenuData(menuData);
    setCategoryData(categoryData);
  }, [products]);

  const settings = {
    infinite: false,
    dots: false,
    draggable: true,
    swipe: true,
    scroll: true,
    swipeToSlide: true,
    speed: 500,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          nextArrow: false,
          prevArrow: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 0,
        }
      },
      {
        breakpoint: 640,
        settings: {
          nextArrow: false,
          prevArrow: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 0,
        }
      }
    ]
  };

  function SampleNextArrow(props) {
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

  function SamplePrevArrow(props) {
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

  const groupedData = (menuData || []).reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  // Define the desired order
  //const categoryOrder = ['Veg Pizza', 'Premium Non Veg', 'Non-Veg Pizza', 'Starters', 'Drinks'];


  const handleClose = () => setModelView(false);  

  const handleCustomizeClick = (item) => {
    setSelectedItem(item);
    setModelView(true);
  };

  const scrollWithOffset = (el) => {
    const yOffset = -(categoryContainerRef.current ? categoryContainerRef.current.clientHeight : 0) - 125;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.25
      };

      const observerCallback = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, options);

      Object.values(sectionsRef.current).forEach(section => {
        if (section) {
          observer.observe(section);
        }
      });

      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuData]);

  useEffect(() => {
    if (activeCategory) {
      const index = categoryData.findIndex(item => item.name === activeCategory);
      if (index !== -1 && sliderRef.current) {
        sliderRef.current.slickGoTo(index);
      }
    }
  }, [activeCategory, categoryData]);

  return (
    <div className='backgroundMenu'>
      {/* Category */}
      <motion.div
        initial={{ opacity: 0, y: 400 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 400 }}
        className='fixed z-20 w-full mt-8 md:mt-24 h-auto' ref={categoryContainerRef}>
        <div className='flex items-center justify-center flex-col'>
          <div className='md:w-[92%] w-full mx-auto md:mt-0 mt-14'>
            <Slider {...settings} ref={sliderRef}>
              {categoryData && categoryData.map(item => (
                <motion.div key={item?.id} className='w-full h-[120px] md:h-28 rounded-b flex flex-col bg-cyan-700 md:px-4 md:py-4 px-2 py-4'>
                  <HashLink smooth to={`#${item?.name}`} scroll={el => scrollWithOffset(el)}>
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      className={`h-[100px] max-h-28 md:h-auto flex items-center justify-start flex-col rounded-2xl ${activeCategory === item?.name ? 'bg-orange-500' : 'bg-none'}`}>
                      <div className='w-full h-auto flex items-center justify-center'>
                        <motion.img
                          src={item?.imageURL}
                          alt='image'
                          className='cursor-pointer md:w-[70px] w-14 h-14 rounded-full hover:drop-shadow-xl'
                        />
                      </div>
                      <div className='w-full items-center justify-center flex flex-col'>
                        <p className='text-white text-center font-semibold text-sm md:text-sm'>{item?.name}</p>
                      </div>
                    </motion.div>
                  </HashLink>
                </motion.div>
              ))}
            </Slider>
          </div>
        </div>
      </motion.div>


      

      {/* Menu */}
      
      <div className='flex pt-36 items-center justify-center'>
        <div className='flex flex-wrap justify-center items-center gap-16 md:mt-20 mt-16'>
        {Object.keys( groupedData).map(category => (
            <div key={category} id={category} ref={el => sectionsRef.current[category] = el} className="w-full mt-16">
              <p className='md:text-[27px] text-xl font-semibold capitalize text-white relative transition-all ease-in-out duration-100 flex justify-center md:ml-24'>
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
                        <p className='text-white font-semibold md:text-lg text-sm mt-4 flex flex-col items-end justify-end sm:text-wrap ml-12 md:ml-12'>
                          {item?.name}
                        </p>
                        <div className='flex flex-col items-end justify-end mt-4'>
                          {item?.smallPrice !== 0 && (
                            <p className='text-white font-semibold text-xs'>Starting</p>
                          )}
                          <p className='text-lg text-white font-semibold'>
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
            </div>
          ))}
        </div>
        {selectedItem && (
          <Customization onClose={handleClose} visible={modelView} data={selectedItem} />
        )}
      </div>


      <main className='w-screen min-h-screen flex items-center justify-center flex-col '>
        <Header />
        {isCart && <Cart />}
      </main>
    </div>
  );
};

export default FullMenuContainer;

