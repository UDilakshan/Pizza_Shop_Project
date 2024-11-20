import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';


function SampleNextArrow(props) {
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

function SamplePrevArrow(props) {
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


function Offers() {

  const settings = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    cssEase: "Ease-In-Out",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: { 
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
        }
      },
       
      {
        breakpoint: 640,
        settings: {
          nextArrow: false, 
          prevArrow: false,
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0
        }
      }
    ]
  };

  const navigate = useNavigate();
  const products = useSelector((state) => state.products);
  const [offer, setOffer] = useState([]);

  useEffect(()=> {
    const offersData = products?.filter((data) => data.category === "OPizza Offers");
    setOffer(offersData);
   }, [products]);

  return (
    <div>
        <div className='flex items-center justify-center md:mt-12 mt-6 '>
        <p className='md:text-2xl text-xl font-bold capitalize text-black relative bg-white px-16 py-2 rounded-3xl'>
         OPizza Offers
        </p>
    </div>
    <div className='flex flex-row mt-10'>
        <div className='md:w-[92%] md:h-[300px] w-full h-20 mx-auto'>
          <div>  
            <Slider {...settings}>
              {offer && offer.map((item) => (  
                <motion.div key={item?.productId} className='w-auto flex items-center justify-center'>
                  <img 
                    src={item?.imageURL} 
                    alt="Pizza Images" 
                    className='h-20 max-h-20 w-[90%] mx-auto md:w-full md:h-[300px] md:max-h-[300px] flex items-center justify-center md:px-4 md:py-2 cursor-pointer md:rounded-3xl rounded-md' 
                     onClick={() => navigate('/offers')} 
                  />
                </motion.div>
              ))}
            </Slider>
          </div>
        </div>    
      </div>
    </div>
    
  );
}

export default Offers;