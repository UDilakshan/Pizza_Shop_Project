import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'; // Added WhatsApp icon
import { contact_types } from '../utils/data';
import { firestore } from '../firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../firebase.config'; // Import Firebase Authentication

const ContactUs = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState(""); // Predefined email
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState("Contact");

  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Simulate fetching logged-in user's email from Firebase Auth
  useEffect(() => {
    const user = auth.currentUser; // Fetch current user from Firebase Auth
    if (user) {
      setEmail(user.email); // Set email from logged-in user
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fname && lname && email && phoneNumber && message && !emailError) {
      if (phoneNumber.length !== 10) {
        setPhoneError("Please enter a valid 10-digit mobile number");
        return;
      }

      try {
        await addDoc(collection(firestore, 'Feedbacks'), {
          fname,
          lname,
          email,
          phoneNumber,
          message,
          feedbackType,
          timestamp: new Date()
        });

        setFname("");
        setLname("");
        setPhoneNumber("");
        setMessage("");
        setEmailError("");
        setPhoneError("");
        setFormSubmitted(true);

        // Hide the formSubmitted message after 3 seconds
        setTimeout(() => {
          setFormSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      setFormSubmitted(false);
    }
  };

  const validateEmailFormat = (input) => pattern.test(input);

  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value.replace(/\D+/g, '');
    if (inputValue.length <= 10) {
      setPhoneNumber(inputValue);
    }
  };

  const handlePhoneClick = () => {
    const phoneNumber = '+94743078892'; 
    window.open(`tel:${phoneNumber}`);
  };

  const handleMailClick = () => {
    window.open('mailto:opizzashop@gmail.com');
  };

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/share/y8dcVtmSSYqq4q7T/?mibextid=qi2Omg', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/pizza0_001?igsh=MTBtZTZmZDdvamJueA==', '_blank');
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = '+94743078892'; 
    const whatsappMessage = 'Hello, I have a query.';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`);
  };

  return (
    <div className="bg-cyan-700 p-20 mt-12 pb-40">
      <div className="w-full max-w-3xl mx-auto mb-8"> {/* Increased form width */}
        
        {/* Rectangle with Icons */}
        <div className="bg-white w-full p-6 rounded-lg flex justify-around mb-8">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handlePhoneClick}
          >
            <FaPhone size={30} className="text-blue-500" />
            <span className="text-sm mt-2">Call Us</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleMailClick}
          >
            <FaEnvelope size={30} className="text-red-500" />
            <span className="text-sm mt-2">Email Us</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleFacebookClick}
          >
            <FaFacebookF size={30} className="text-blue-600" />
            <span className="text-sm mt-2">Facebook</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleInstagramClick}
          >
            <FaInstagram size={30} className="text-pink-500" />
            <span className="text-sm mt-2">Instagram</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleWhatsAppClick}
          >
            <FaWhatsapp size={30} className="text-green-500" />
            <span className="text-sm mt-2">WhatsApp</span>
          </div>
        </div>

        {/* Feedback Form Rectangle with Title */}
        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">FEEDBACK FORM</h2>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit}>
            <div className='w-full mb-6'>
              <div className='flex items-center gap-2'>
                <select
                  className='outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                >
                  <option value="Contact" className='bg-white'>Contact</option>
                  {contact_types && contact_types.map(item => (
                    <option key={item.id} className='text-base border-0 outline-none capitalize bg-white text-headingColor' value={item.urlParamName}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                <label className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2" htmlFor="grid-first-name">First Name</label>
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  placeholder=""
                  value={fname}
                  onChange={(e) => setFname(e.target.value.replace(/[^A-Za-z]/ig, '').substring(0, 20))}
                  required
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2" htmlFor="grid-last-name">Last Name</label>
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  placeholder=""
                  value={lname}
                  onChange={(e) => setLname(e.target.value.replace(/[^A-Za-z]/ig, '').substring(0, 20))}
                  required
                />
              </div>
            </div>

            {/* Email and Phone on the same line */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2" htmlFor="grid-email">Email</label>
                <input
                  className={`appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${emailError ? 'border-red-500' : ''}`}
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  readOnly // Make email field read-only
                />
                {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2" htmlFor="grid-phone">Mobile Number</label>
                <input
                  className={`appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${phoneError ? 'border-red-500' : ''}`}
                  type="text"
                  placeholder=""
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  required
                />
                {phoneError && <p className="text-red-500 text-xs italic">{phoneError}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2" htmlFor="grid-message">Message</label>
              <textarea
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder=""
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>

        {formSubmitted && (
          <div className="mt-6 text-center text-white">
            <p>Thank you for your feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
