import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { Route, Routes, useLocation } from "react-router-dom";
import { Login } from './containers';
import { getAuth,onAuthStateChanged } from "firebase/auth";
import {app} from './config/firebaseconfig';
import { validateUserJWTToken } from "./api"; 
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./context/actions/userActions";
import { fadeInOut } from "./animations";
import { Alert, MainLoader, Header, Footer, Dashboard, Profile, ContactUs, AboutUs, 
HomeContainer,ResetPassword, FAQs, PrivacyPolicy} from './components';
import { setCartItems } from "./context/actions/cartAction";
import { getAllCartItems} from "./api";


const App = () => {
    const alert = useSelector(state => state.alert);
    const firebaseAuth = getAuth(app);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
  

    useEffect(() => {
      setIsLoading(true);
      const unsubscribe = firebaseAuth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUserJWTToken(token).then((data) => {
              if (data) {
                getAllCartItems(data.user_id).then((items) => {
                  console.log(items);
                  dispatch(setCartItems(items)); 
                });
              }
              dispatch(setUserDetails(data)); 
            }).finally(() => {
              setIsLoading(false); 
            });
          }).catch((error) => {
            console.error('Error fetching token:', error);
            setIsLoading(false); 
          });
        } else {
          setIsLoading(false); 
        }
      });
    
      
      return () => unsubscribe();
    }, []);
    
    



const useHeaderVisibility = () => {
  const location = useLocation();
  return location.pathname !== '/Dashboard' 
  && location.pathname !== '/Dashboard/home' 
  && location.pathname !== '/Dashboard/orders' 
  && location.pathname !== '/Dashboard/items'
  && location.pathname !== '/Dashboard/addnewitems'
  && location.pathname !== '/Dashboard/users'
  && location.pathname !== '/Dashboard/feedback'
  && location.pathname !== '/Login'
};

const useFooterVisibility = () => {
  const location = useLocation();
  return location.pathname !== '/Dashboard' 
  && location.pathname !== '/Dashboard/home' 
  && location.pathname !== '/Dashboard/orders' 
  && location.pathname !== '/Dashboard/items'
  && location.pathname !== '/Dashboard/addnewitems'
  && location.pathname !== '/Dashboard/users'
   && location.pathname !== '/Dashboard/feedback'
  && location.pathname !== '/Login'

  && location.pathname !== '/Profile'
  && location.pathname !== '/Profile/deleteaccount'
  && location.pathname !== '/Profile/edit'
  && location.pathname !== '/Profile/feedback'
  && location.pathname !== '/Profile/history'
};

const showHeader = useHeaderVisibility();
const showFooter = useFooterVisibility();

  return (

      <div className="flex flex-col min-h-screen">
      {isLoading && (
          <motion.div {...fadeInOut} className='fixed z-50 inset-0 bg-cardOverlay backdrop:blur-md flex items-center justify-center w-full'>
            <MainLoader />
          </motion.div> 
      )}
          
          <main className="flex-grow">
          {showHeader && <Header />} 
          <Routes>
            <Route path='/' element={<HomeContainer />} />
            <Route path='/Login' element={<Login />} />
            <Route path="/reset-password/:oobCode" element={<ResetPassword/>} />
            <Route path='/ContactUs' element={<ContactUs/>} />
            <Route path='/AboutUs' element={<AboutUs/>} />
            <Route path='/FAQs' element={<FAQs/>} />
            <Route path = '/PrivacyPolicy' element={<PrivacyPolicy/>} />
            <Route path="/Dashboard/*" element={<Dashboard />} />  
            <Route path="/Profile/*" element={<Profile />} />  
            

  
         </Routes>
         {showFooter && <Footer />}
         </main>
         
        { alert?.type && <Alert type={alert?.type} message={alert?.message}/>}
    </div>
  )
}

export default App