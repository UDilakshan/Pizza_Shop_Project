import React, {useState} from "react";
import { MdLogout, MdSearch } from "react-icons/md";
import { BsFillBellFill, BsToggles2 } from "react-icons/bs";
import Logo2 from "../assets/images/OtherImages/Logo2.png";
import {NavLink} from "react-router-dom";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import Avatar from "../assets/images/OtherImages/Avatar.jpg";
 import { useNavigate } from "react-router-dom";
 import { useSelector, useDispatch } from "react-redux";
 import { getAuth, signOut } from "firebase/auth";
 import { app } from "../firebase.config";
 import { setUserNull } from "../context/actions/userActions";
 import { SlideInTop200 } from "../animations";
 import {home} from  "../Dashboard/DBLeftSection";
 import {orders} from  "../Dashboard/DBLeftSection";
 import {items} from  "../Dashboard/DBLeftSection";
 import {addnewitems} from  "../Dashboard/DBLeftSection";
 import { Link } from "react-router-dom";

const DBHeader = () => {
   const user = useSelector((state) => state.user);
    const firebaseAuth = getAuth(app);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLogout, setIsLogout] = useState(false);
    const [activeSection, setActiveSection] = useState("home"); // Default to 'home'
    const orders= useSelector(state => state.orders)


    const handleSearch = (event) => {
      const query = event.target.value.toLowerCase();
 
      if (query.includes("home")) {
        navigate("/dashboard/home"); // Update this path based on your routing setup
      } else if (query.includes("orders")) {
        navigate("/dashboard/orders"); // Update this path based on your routing setup
      } else if (query.includes("items")) {
        navigate("/dashboard/items"); // Update this path based on your routing setup
      } else if (query.includes("add new items")) {
        navigate("/dashboard/add-new-items"); // Update this path based on your routing setup
      } else if (query.includes("users")) {
        navigate("/dashboard/users"); // Update this path based on your routing setup
      } else if (query.includes("feedback")) {
        navigate("/dashboard/feedback"); // Update this path based on your routing setup
      }
    };
   
    const Logout = () => {
      setIsLogout(false);
       signOut(firebaseAuth)
          .then(() => {
             dispatch(setUserNull());
             navigate("/Login", { replace: true });
          })
         .catch((err) => console.log(err));
        }
   
       

  return (

    <div {...SlideInTop200} className="fixed z-30 w-full top-0 p-4 cursor-pointer md:h-20 h-[100px] bg-gray-100 backdrop-blur-lg shadow-sm">

            {/* Desktop */}    
     
      <div className=" hidden  md:flex items-center justify-center">

        <NavLink to = {"/"} className="flex items-center justify-start gap-2 px-2">
        <img src= {Logo2} className = "w-12" alt="" />
        <p className="font-semibold text-2xl text-red-600 underline">O'Pizza</p>
        </NavLink>

      <div className="w-full flex items-center justify-end gap-3 ml-auto">
          <p className="text-xl text-headingColor">Welcome to Admin Dashboard
            {
              user?.name && (
                <span className="text-2xl text-cyan-800">{` ${user?.name}!`}</span>
              )
            }
          </p>

            {/* <div className="flex items-center justify-center gap-3 py-2 px-4 bg-lightOverlay backdrop-blur-md rounded-md shadow-md">
              <MdSearch className="text-gray-600 text-2xl" />
              <input
                type="text"
                placeholder="Search Here..."
                className="border-none outline-none bg-transparent w-32 text-base font-semibold text-textColor"
                 onChange={handleSearch}
              />
              <BsToggles2 className="text-gray-600 text-2xl" />
             
            </div> */}
            <div>
              {activeSection === "home" && <home />}
              {activeSection === "orders" && <orders />}
              {activeSection === "items" && <items/>}
              {activeSection === "add-new-items" && <addnewitems />}
             
            </div>



            <Link to={'/Dashboard/orders'}>
            <motion.div
              {...buttonClick}
              className="w-10 h-10 rounded-md cursor-pointer bg-lightOverlay backdrop-blur-md shadow-md flex items-center justify-center"
            >

             
              <BsFillBellFill className="text-gray-600 text-xl" />
              <Link/>
              {
                   orders && orders?.length > 0 &&
                 (
                <div className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center'>
                <p className='text-xs text-black font-semibold'>{orders?.length} </p>
            </div>
                 )}

             
            </motion.div>
            </Link>
           
            <div className="flex items-center justify-center gap-2">
              {/* <div className="w-10 h-10 bg-black rounded-full shadow-md cursor-pointer overflow-hidden">
                <motion.img
                  className="w-full h-full object-cover rounded-full"
                  src={user?.picture ? user.picture : Avatar}
                  whileHover={{ scale: 1.15 }}
                  referrerPolicy="no-referrer"
                />
              </div> */}

              <motion.div
                {...buttonClick}
                onClick={Logout}
                className="w-10 h-10 rounded-md cursor-pointer bg-lightOverlay backdrop-blur-md shadow-md flex items-center justify-center"
              >
                <MdLogout className="text-gray-600 text-xl" />
              </motion.div>
            </div>
      </div>

      </div>
     

            {/* Mobile */}
    <div className="md:hidden w-full h-full flex items-center justify-between">

      <div className="flex items-center justify-center gap-2 flex-col">

        <div className="flex items-center justify-center gap-8">
         
            <NavLink to = {"/"} className="flex items-center justify-start gap-1 px-1">
               <img src= {Logo2} className = "w-8" alt="" />
                <p className="font-semibold text-lg text-red-600 underline">O'Pizza</p>
          </NavLink>      

          <div className="flex items-center justify-center py-1 px-2 bg-lightOverlay backdrop-blur-md rounded-md shadow-md ml-2">
              <MdSearch className="text-gray-600 text-base" />
              <input
                type="text"
                placeholder="Search..."
                className="border-none outline-none bg-transparent w-24 text-base font-semibold text-textColor"
              />
          </div>
           

          <div className="flex items-center justify-center gap-4">
          <motion.div
            {...buttonClick}
            className="w-8 h-8 rounded-md cursor-pointer bg-lightOverlay backdrop-blur-md shadow-md flex items-center justify-center">
            <BsFillBellFill className="text-black text-xl" />
          </motion.div>

          <div className="w-10 h-10 bg-black rounded-full shadow-md cursor-pointer overflow-hidden">
            <motion.img
            className="w-full h-full object-cover rounded-full"
            src={user?.picture ? user.picture : Avatar}
            whileHover={{ scale: 1.15 }}
            onMouseEnter={()=>setIsLogout(true)}
            referrerPolicy="no-referrer"
            />
         </div>

         {
           isLogout && (
         
          <motion.div onMouseLeave={()=>setIsLogout(false)}
            initial = {{opacity:0, x: 200, scale: 0.6 }}
            animate = {{opacity:1, x: 0,scale: 1 }}
            exit = {{opacity:0, x: 200, scale: 0.6 }}
            {...buttonClick}
            onClick={Logout}
            className="w-10 h-10 rounded-md cursor-pointer bg-lightOverlay backdrop-blur-md shadow-md flex flex-col absolute top-[70px] right-4 items-center justify-center"
          >
            <MdLogout className="text-gray-600 text-xl" />
          </motion.div>
        )}
          </div>


        </div>
           
        <div className="w-full flex items-start justify-start px-3">
           <p className="text-sm text-black">Welcome to 
               {
                 user?.name && (
                   <span className="text-sm text-cyan-800">{` ${user?.name}!`}</span>
                )
                }
          </p>
        </div>      
      </div>  
  </div>          
</div>
   
  );
};

export default DBHeader;