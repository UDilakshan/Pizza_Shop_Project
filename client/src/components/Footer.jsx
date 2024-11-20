import React from "react";
import { FaFacebook, FaInstagram,FaPhone, FaEnvelope, FaWhatsapp , FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

const handleWhatsAppClick = () => {
  const whatsappNumber = '+94743078892'; 
  const whatsappMessage = 'Hello, I have a query.'; 
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`);
};

const handleMailClick = () => {
  window.open('mailto:opizzashop@gmail.com');
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
      
        <div className="footer-section">
          <h3>About Opizza</h3>
          <p>
            Opizza is your favorite online pizza shop delivering delicious pizzas
            to your doorstep. We use only fresh ingredients to make every bite amazing.
          </p>
        </div>

        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/FullMenuContainer">Menu</a></li>
            <li><a href="/AboutUs">About Us</a></li>
            <li><a href="/ContactUs">Contact Us</a></li>
            <li><a href="/FAQs">FAQs</a></li>
          </ul>
        </div>

        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="footer-contact-item">
            <FaPhone className="footer-icon" /> +94 777134777
          </div>
          <div className="footer-contact-item">
            <FaEnvelope className="footer-icon" /> opizzashop@gmail.com
          </div>
          <div className="footer-contact-item">
            <FaMapMarkerAlt className="footer-icon" />
            <span>
              15/2, 10th Lane<br />
              Thalankavil Pillayar Road
            </span>
          </div>
        </div>

        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="footer-social-icons">
            <a href="https://web.facebook.com/Jaffnapizza?mibextid=qi2Omg&rdid=8EZjm0vwR34qMV6d&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2Fy8dcVtmSSYqq4q7T%2F%3Fmibextid%3Dqi2Omg%26_rdc%3D1%26_rdr" target="_blank" rel="noreferrer">
              <FaFacebook size={20} />
            </a>
            <a href="https://www.instagram.com/pizza0_001?igsh=MTBtZTZmZDdvamJueA==" target="_blank" rel="noreferrer">
              <FaInstagram size={20} />
            </a>
            <a onClick={handleMailClick} style={{ cursor: 'pointer' }}>
              <FaEnvelope size={20} />
           </a>
            <a href="tel:+94 777134777" target="_blank" rel="noreferrer">
              <FaPhoneAlt size={20} /> 
           </a>
           <a onClick={handleWhatsAppClick} style={{ cursor: 'pointer' }} >
              <FaWhatsapp size={20} />
          </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Opizza. All Rights Reserved.</p>
        <p><a href="/PrivacyPolicy">Privacy Policy</a></p>
      </div>
    </footer>
  );
};

export default Footer;
