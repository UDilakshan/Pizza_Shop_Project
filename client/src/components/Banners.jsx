import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';


function Banners() {

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: false,
    autoplaySpeed: 3000,
    cssEase: "Ease-In-Out",
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: { 
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
        }
      },
       
      {
        breakpoint: 640,
        settings: {
          nextArrow: false, 
          prevArrow: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0
        }
      }
    ]
  };

  const products = useSelector((state) => state.products);
  const [banner, setBanner] = useState([]);

  useEffect(()=> {
    const bannersData = products?.filter((data) => data.category === "Banners");
    setBanner(bannersData);
   }, [products]);

  return (
    <>
      <div className='flex flex-row'>
        <div className='md:w-[92%] md:h-[200px] w-full h-20 mx-auto'>
          <div>  
            <Slider {...settings}>
              {banner && banner.map((item) => (  
                <motion.div key={item?.productId} className='w-auto flex items-center justify-center'>
                  <img 
                    src={item?.imageURL} 
                    alt="Banners" 
                    className='h-20 max-h-20 w-[90%] mx-auto md:w-full md:h-[200px] md:max-h-[200px] flex items-center justify-center rounded-xl' 
                  />
                </motion.div>
              ))}
            </Slider>
          </div>
        </div>    
      </div>
      <div className='flex items-center justify-center w-full bg-black mt-2 md:mt-5 md:py-3 py-2'></div>
    </>
  );
}

export default Banners;
