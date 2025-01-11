import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { Login } from "./containers";
import { getAuth } from "firebase/auth";
import { app } from "./config/firebaseconfig";
import { validateUserJWTToken } from "./api";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  MainLoader,
  Header,
  Footer,
  Dashboard,
  Profile,
  ContactUs,
  AboutUs,
  HomeContainer,
  ResetPassword,
  Cart,
  Chatbot,
  openaiClient,
  FAQs,
  PrivacyPolicy,
  DeveloperDetails 
} from "./components";
import { setUserDetails } from "./context/actions/userActions";
import { setCartItems } from "./context/actions/cartAction";
import { getAllCartItems } from "./api";
import { FaQ } from "react-icons/fa6";

const App = () => {
  const alert = useSelector((state) => state.alert);
  const firebaseAuth = getAuth(app);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // State to manage cart visibility
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    firebaseAuth.onAuthStateChanged((cred) => {
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
          });
        });
      }
      else {
        // If the user is logged out, navigate to the login page
       // navigate('/login');
        // Prevent back navigation to the previous page
       {/* window.history.pushState() allows you to manipulate the browser's history without actually navigating to a new page.
        The first argument (null) is the state object that you want to associate with the new history entry. It's not used here, so it's set to null.
        The second argument (null) is the title for the new state (this isn't really used by most browsers anymore, but it must be provided).
        The third argument (window.location.href) is the current URL of the page (i.e., the page the user is on when they log out). This effectively pushes the current URL onto the history stack.*/}
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = () => {
          window.history.pushState(null, null, window.location.href);
        };
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    });
  }, []);

  const useHeaderVisibility = () => {
    const location = useLocation();
    return (
      location.pathname !== "/Dashboard" &&
      location.pathname !== "/Dashboard/home" &&
      location.pathname !== "/Dashboard/orders" &&
      location.pathname !== "/Dashboard/items" &&
      location.pathname !== "/Dashboard/addnewitems" &&
      location.pathname !== "/Dashboard/users" &&
      location.pathname !== "/Dashboard/feedback" &&
      location.pathname !== "/Login"
    );
  };

  const useFooterVisibility = () => {
    const location = useLocation();
    return (
      location.pathname !== "/Dashboard" &&
      location.pathname !== "/Dashboard/home" &&
      location.pathname !== "/Dashboard/orders" &&
      location.pathname !== "/Dashboard/items" &&
      location.pathname !== "/Dashboard/addnewitems" &&
      location.pathname !== "/Dashboard/users" &&
      location.pathname !== "/Dashboard/feedback" &&
      location.pathname !== "/Login" &&
      location.pathname !== "/Profile" &&
      location.pathname !== "/Profile/deleteaccount" &&
      location.pathname !== "/Profile/edit" &&
      location.pathname !== "/Profile/feedback" &&
      location.pathname !== "/Profile/history"
    );
  };

  const showHeader = useHeaderVisibility();
  const showFooter = useFooterVisibility();

  // Function to toggle the cart's state
  const toggleCart = () => {
    setIsCartOpen((prevState) => !prevState); // Toggle the cart open/close state
  };

  const CartOpen = () =>{
    setIsCartOpen(true);
  }

  const CartClose = () =>{
    setIsCartOpen(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading && (
        <motion.div
          className="fixed z-50 inset-0 bg-cardOverlay backdrop-blur-md flex items-center justify-center w-full"
        >
          <MainLoader />
        </motion.div>
      )}

      <main className="flex-grow">
        {showHeader && <Header CartOpen={CartOpen} CartClose={CartClose} isCartOpen={isCartOpen} toggleCart={toggleCart} />}

        <div className="flex">
          <div
            className={`transition-all ease-in-out duration-300 ${isCartOpen ? "w-[70%]" : "w-full"}`}
          >
            <Routes>
              {/* Pass isCartOpen to HomeContainer */}
              <Route
                path="/"
                element={<HomeContainer CartOpen={CartOpen} isCartOpen={isCartOpen} />}
              />
              <Route path="/Login" element={<Login />} />
              <Route
                path="/reset-password/:oobCode"
                element={<ResetPassword />}
              />
              <Route path="/ContactUs" element={<ContactUs />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/Dashboard/*" element={<Dashboard />} />
              <Route path="/Profile/*" element={<Profile />} />
              <Route path='/Chatbot' element={<Chatbot/>} />
              <Route path='/FAQs' element={<FAQs/>} />
              <Route path='/PrivacyPolicy' element={<PrivacyPolicy/>} />
              <Route path="/developer-details" element={<DeveloperDetails />} />
            </Routes>
          </div>

          {/* Render Cart conditionally */}
          {isCartOpen && (
           
              <Cart />
        
          )}
        </div>
        {showFooter && <Footer />}
      </main>
      {alert?.type && <Alert type={alert?.type} message={alert?.message} />}
    </div>
  );
};

export default App;
