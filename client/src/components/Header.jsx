import React, { useState,useEffect } from 'react';
import {app} from "../firebase.config";
import {MdLogin, MdLogout,FaBasketShopping,TfiMenuAlt,IoHome, FaCircleUser,BiSolidFoodMenu,RiContactsBook2Fill } from '../assets/icons'
import { motion } from 'framer-motion';
import { getAuth,onAuthStateChanged} from "firebase/auth";
import  log  from '../assets/images/OtherImages/log.png';
import { setCartOn } from '../context/actions/displaycartAction';
import Logo from "../assets/images/OtherImages/Logo.png";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { buttonClick, SlideIn200 } from '../animations';
import { setUserNull,setUserDetails} from '../context/actions/userActions';
//import { CartItemCard } from '../api/index';
import { PiShoppingCartBold } from "react-icons/pi";
import { getDoc, doc,setDoc } from "firebase/firestore";
import { db } from "../config/firebaseconfig";
import Avatar3 from '../assets/images/OtherImages/Avatar3.png';

function Header() {
  
    const firebaseAuth = getAuth(app); 
    const user = useSelector(state => state.user)
    const [isMenu, setIsMenu] = useState(false);
    const cart= useSelector(state => state.cart)
    const [tempIsmenu, setTempIsmenu] = useState(false)
    const [headerview, setHeaderView] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const location = useLocation();


    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);

    const logout = async () => {
      setIsMenu(false);
      try {
        await firebaseAuth.signOut();
        dispatch(setUserNull());
        navigate('/Login', { replace: true });
      } catch (err) {
        console.log(err);
      }
    };
    

  const viewClientMenu = () =>{
    setIsMenu(false);
    setTempIsmenu(!tempIsmenu);
  }
        
  const viewDashboardMenu = () =>{
    setIsMenu(true);
    setTempIsmenu(false);
  } 
  
  const hideAllMenu = () =>{
    setIsMenu(false);
    setTempIsmenu(false);
  }

  const handleMenuClick = () => {
    if (location.pathname !== "/") {
        // Navigate to Home first
        navigate("/");
        setTimeout(() => {
            scrollToMenu();
        }, 100); // Delay to ensure the page has loaded
    } else {
        // If already on Home, scroll directly
        scrollToMenu();
    }
};

const scrollToMenu = () => {
  const menuDiv = document.querySelector("#menuSection");
  if (menuDiv) {
    // Define yOffset based on screen size
    const isMobile = window.innerWidth <= 768; // Adjust this breakpoint as needed
    const yOffset = isMobile ? -400 : -320; // Mobile offset: -400, Desktop offset: -320

    const yPosition = menuDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: yPosition, behavior: "smooth" });
  }
};


 
useEffect(() => {
  const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
    setLoading(true);
    if (user) {
      try {
        await user.reload();
        const updatedUser = firebaseAuth.currentUser;
        dispatch(setUserDetails(updatedUser)); // Update user details in Redux

        // Check and update photoURL
        if (!updatedUser.photoURL) {
          try {
              await updatedUser.updateProfile({ photoURL: log });
              console.log("Profile picture updated successfully.");
              await updatedUser.reload(); // Ensure the latest info is fetched
              dispatch(setUserDetails(updatedUser));
          } catch (err) {
              console.error('Error updating profile picture:', err);
          }
      }

        // Fetch additional user details from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const { phoneNumber, address } = userData;
          dispatch(setUserDetails({ ...updatedUser,...userData, phoneNumber, address }));
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.log("Error updating user:", err);
      }
    } else {
      dispatch(setUserNull());
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, [dispatch, firebaseAuth]);



    if(!headerview) return null;


  return (
    <div className='fixed z-40 w-screen top-0 h-24 p-3 px-4 md:p-6 md:px-16 cursor-pointer bg-black'>


        {/* desktop */}


            {/* Navigation Bar */}

        <div className='hidden md:flex w-full h-full items-center justify-between'>
              <Link to = {"/"} className='flex items-center gap-2'>
                  <img src={Logo} className='object-cover w-20 -ml-10' alt="Logo" />
                  <p className='text-red-100 font-pacifico text-3xl font-bold'>Pizza Shop</p>
              </Link>

              <div className='flex items-center gap-8'>

              <motion.ul onClick={()=>setIsMenu(false)} {...SlideIn200}
              className='flex items-center gap-8'>
                      <Link to = {"/"}>
                      <motion.li {...buttonClick} >
                            <div className='flex gap-1 text-base text-red-100 hover:text-orange-500 duration-100 transition-all ease-in-out cursor-pointer'>
                                <IoHome className='mt-[2.5px]'/>
                                <p>Home</p>
                            </div>  
                      </motion.li>
                    </Link>

                  <motion.li{...buttonClick} >
                            <div onClick={handleMenuClick} className='flex gap-1 text-base text-red-100 hover:text-orange-500 duration-100 transition-all ease-in-out cursor-pointer'>
                                <BiSolidFoodMenu className='mt-[2.5px]'/>
                                <p>Menu</p>
                            </div>  
                      </motion.li>
                   

                  <Link to = {"/AboutUs"}>
                  <motion.li {...buttonClick} >
                            <div className='flex gap-1 text-base text-red-100 hover:text-orange-500 duration-100 transition-all ease-in-out cursor-pointer'>
                                <FaCircleUser className='mt-[2.5px]'/>
                                <p>About Us</p>
                            </div>  
                      </motion.li>
                    </Link>

                  <Link to = {"/ContactUs"}>
                    <motion.li {...buttonClick} >
                            <div className='flex gap-1 text-base text-red-100 hover:text-orange-500 duration-100 transition-all ease-in-out cursor-pointer'>
                                <RiContactsBook2Fill className='mt-[2.5px]'/>
                                <p>Contact Us</p>
                            </div>  
                      </motion.li>
                    </Link>
              </motion.ul>



            {/* Cart */}
              
              <motion.div
                 {...SlideIn200} {...buttonClick} 
                 onClick={() => dispatch(setCartOn())} 
               className='mb-2 relative flex items-center rounded-full  justify-center'>
               <PiShoppingCartBold className='text-red-100 text-2xl cursor-pointer' />
  
                 {
                   cart && cart?.length > 0 && 
                 (
                <div className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center'>
                <p className='text-xs text-black font-semibold'>{cart?.length} </p>
            </div>
                 )}
         </motion.div>



                  {/* User Information */}

                  {
              user ? (
                user.emailVerified ? (
                  <div className='relative cursor-pointer flex items-center gap-3'>
                    <motion.div {...SlideIn200} className='flex items-center '>
                      <motion.div className='relative w-10 h-10'>
                         <motion.img {...buttonClick}
                            onClick={() => setIsMenu(!isMenu)}
                            src={Avatar3}
                            className='w-9 h-9 rounded-full object-cover border-2 border-white shadow-md'
                            referrerPolicy='no-referrer'
                            alt="User"
                            onError={(e) => {
                              e.target.onerror = null; 
                              console.log('Failed to load the image:', e);
                              e.target.src = log; 
                            }}
                         />
                       </motion.div>
                  </motion.div>

                    <div className='flex flex-col'>
                     
                        {
                              isMenu && (
                                  <motion.div {...SlideIn200} onClick={()=>setIsMenu(false)} className='w-36 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 -right-10'>

                                {   
                                    user && (       

                                      <Link to = {"/Profile"}>
                                          <p className='px-4 py-2 flex items-center gap-2 cursor-pointer hover: bg-white
                                          transition-all duration-100 ease-in-out text-black text-base rounded-lg hover:bg-slate-200 font-semibold' onClick={()=>setIsMenu(false)}>
                                          My Profile </p>
                                      </Link> 

                                    )}

                                    {

                                      user && user.email === "opizzashop@gmail.com" && ( 
                                        
                                      <Link to = {"/Dashboard"}>
                                          <p className='px-4 py-2 flex items-center gap-2 cursor-pointer hover: bg-white
                                          transition-all duration-100 ease-in-out text-black text-base rounded-lg hover:bg-slate-200 font-semibold' 
                                          onClick={()=>setIsMenu(false)}>
                                          Dashboard </p>
                                      </Link> 
                                      
                                      )}

                                    {
                                      user && ( 

                                      <p {...buttonClick} className='px-4 py-2 flex items-center justify-center gap-3 cursor-pointer hover: bg-slate-100
                                          transition-all duration-100 ease-in-out text-black text-base font-semibold rounded-lg hover:bg-slate-200' onClick={logout}>
                                          Logout <MdLogout /> </p> 
                                      )}

                              </motion.div>
                              )
                            } 

                    </div>
                    </div>
                         
                        ) : (
                          <Link to={"/Login"}>
                            <motion.div {...SlideIn200} {...buttonClick} className='border border-l-pink-50 rounded-md px-2 py-1 hover:bg-white hover:text-orange-500 text-red-100 text-base duration-100 transition-all ease-in-out cursor-pointer flex gap-1'>
                              Login <MdLogin {...SlideIn200} className='mt-1' />
                            </motion.div>
                          </Link>
                        )
                      ) : 
                      


                      (
                        <Link to={"/Login"}>
                          <motion.div {...SlideIn200} {...buttonClick} className='border border-l-pink-50 rounded-md px-2 py-1 hover:bg-white hover:text-orange-500 text-red-100 text-base duration-100 transition-all ease-in-out cursor-pointer flex gap-1'>
                            Login <MdLogin {...SlideIn200} className='mt-1' />
                          </motion.div>
                        </Link>
                    )}
                
                </div>
        </div>
                  

        {/* mobile */}
      
        <div className='flex items-center justify-between md:hidden w-full h-full'>
        

        {/* Cart */}

        <motion.div onClick={hideAllMenu} {...SlideIn200} {...buttonClick} className='relative flex items-center justify-center'>
            <PiShoppingCartBold onClick={() => dispatch(setCartOn())}  className='text-red-100 text-2xl cursor-pointer'  />
                   {
                   cart && cart?.length > 0 && 
  (
                <div className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center'>
                <p className='text-xs text-white font-semibold'>{cart?.length}</p>
            </div>
  )}
         </motion.div>


          <Link onClick={hideAllMenu} to = {"/"} className='flex items-center gap-2'>
              <img src={Logo} className='object-cover w-12' alt="Logo" />
              <p className=' font-pacifico text-slate-100 text-xl font-bold'>Pizza Shop</p>
          </Link>
        
          <div onClick={()=>setTempIsmenu(false)} className='relative'>



            {/* User details */}
                  
             {
                  user? (

                    user.emailVerified ? (
                    
                    <div className='relative cursor-pointer'>
                    <motion.div {...SlideIn200} className='w-8 h-8 drop-shadow-md cursor-pointer overflow-hidden rounded-full'>
                      <motion.img
                      {...buttonClick}
                      onClick={() => setIsMenu(!isMenu)}
                      src={Avatar3}
                      whileHover={{scale : 1.15}} 
                      className='w-full h-full object-cover'
                      referrerPolicy='no-referrer' 
                      alt="User"/>
                    </motion.div>


                    {
                          isMenu && (
                              <motion.div {...SlideIn200}  className='w-36 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-2'>

                            {   
                                user && (       

                                  <Link to = {"/Profile"}>
                                      <p className='px-4 py-2 flex items-center gap-2 cursor-pointer hover: bg-white
                                      transition-all duration-100 ease-in-out text-black text-base rounded-lg hover:bg-slate-200 font-semibold' onClick={()=>setIsMenu(false)}>
                                      My Profile </p>
                                  </Link> 

                                )}

                                {

                                  user && user.email === "opizzashop@gmail.com" && ( 
                                    
                                  <Link to = {"/Dashboard"}>
                                      <p className='px-4 py-2 flex items-center gap-2 cursor-pointer hover: bg-white
                                      transition-all duration-100 ease-in-out text-black text-base rounded-lg hover:bg-slate-200 font-semibold' 
                                      onClick={()=>setIsMenu(false)}>
                                      Dashboard </p>
                                  </Link> 
                                  
                                  )}

                                {
                                  user && ( 

                                  <p {...buttonClick} className='px-4 py-2 flex items-center justify-center gap-3 cursor-pointer hover: bg-slate-100
                                      transition-all duration-100 ease-in-out text-black text-base font-semibold rounded-lg hover:bg-slate-200' onClick={logout}>
                                      Logout <MdLogout /> </p> 
                                  )}

                          </motion.div>
                          )
                        } 

                   </div>

                      ) :

                      (

                        <>
                        <Link to = {"/Login"}>
                            <motion.div {...SlideIn200} {...buttonClick} className='border border-l-pink-50 rounded-md px-2 py-1 hover:bg-white  hover:text-orange-500 text-red-100 text-base duration-100 transition-all ease-in-out cursor-pointer flex gap-1'>Login <MdLogin {...SlideIn200} className='mt-1'/>
                            </motion.div>
                         </Link>
              </>

                      )

            ) :  
            
            (
            <>
                      <Link to = {"/Login"}>
                          <motion.div {...SlideIn200} {...buttonClick} className='border border-l-pink-50 rounded-md px-2 py-1 hover:bg-white  hover:text-orange-500 text-red-100 text-base duration-100 transition-all ease-in-out cursor-pointer flex gap-1'>Login <MdLogin {...SlideIn200} className='mt-1'/>
                          </motion.div>
                       </Link>
            </>
            

            )
            

          }
        </div>


          
          {/* Menu item */}
         
          <div className='relative'>    
              <motion.div
              {...SlideIn200}
              {...buttonClick}>
                <TfiMenuAlt onClick={viewClientMenu} className=' mt- font-pacifico text-slate-100 text-xl font-bold' />
              </motion.div>

              {
                tempIsmenu && (                    
                  <motion.div  

                  initial = {{opacity:0, x: 200, scale: 0.6 }} 
                  animate = {{opacity:1, x: 0,scale: 1 }} 
                  exit = {{opacity:0, x: 200, scale: 0.6 }} 
                  className='w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-10 right-0'>

              <ul onClick={()=>setTempIsmenu(false)}
                  className='flex flex-col gap-1'>
                <Link to = {"/"}>
                  <motion.li {...buttonClick}>
                        <div className='flex hover:bg-orange-500 hover:text-slate-100 duration-100
                        transition-all ease-in-out cursor-pointer mt-4' onClick={()=>setTempIsmenu(false)}>
                        <IoHome className='mt-1 ml-4'/>
                        <p className='text-lg px-1'>
                          Home </p>
                        </div>  
                  </motion.li>
                </Link>


                <motion.li{...buttonClick} >
                  <div onClick={handleMenuClick}>
                  <div onClick={()=>setTempIsmenu(false)} className='flex hover:bg-orange-500 hover:text-slate-100 duration-100 transition-all ease-in-out cursor-pointer'>
                        <BiSolidFoodMenu className='mt-1 ml-4'/>
                        <p className='text-lg px-1'>Menu</p>
                    </div> 
                  </div>
                     
                      </motion.li>
                      

              <Link to = {"/AboutUs"}>
                <motion.li {...buttonClick}>
                        <div className='flex hover:bg-orange-500 hover:text-slate-100 duration-100
                        transition-all ease-in-out cursor-pointer' onClick={()=>setTempIsmenu(false)}>
                        <FaCircleUser className='mt-1 ml-4'/>
                        <p className='text-lg px-1'>
                          About Us </p>
                        </div>  
                  </motion.li>
              </Link>

              <Link to = {"/ContactUs"}>
              <motion.li {...buttonClick}>
                        <div className='flex hover:bg-orange-500 hover:text-slate-100 duration-100
                        transition-all ease-in-out cursor-pointer mb-4' onClick={()=>setTempIsmenu(false)}>
                        <RiContactsBook2Fill className='mt-1 ml-4'/>
                        <p className='text-lg px-1'>
                          Contact Us </p>
                        </div>  
                  </motion.li>
              </Link>
              </ul>
              </motion.div>
              )
              }

          </div>
        
        </div>
</div>
  )
}

export default Header;