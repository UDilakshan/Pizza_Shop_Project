import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa'; 
import About from "../assets/images/OtherImages/About.gif";

const AboutUs = () => {
  return (
    <div className="flex items-center justify-center bg-cyan-700 py-20">
      <div className="max-w-4xl px-8 py-12 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl text-center font-semibold mb-6">Welcome to O'Pizza</h2>
        <div className="flex justify-center mb-8">
          <img
            src={About}
            alt="About"
            className="w-96 h-auto rounded-md shadow-2xl"
          />
        </div>

        <ul className="list-disc pl-8">
          <li>
            <span className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <a href="https://maps.app.goo.gl/bsn3BgkRqAiap26v6" target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>Visit us on Google Maps</a>
            </span>
          </li>
        </ul>
        <br />

        <ul className="list-disc pl-8">
          <li>Welcome to <span style={{ color: 'red'}}>O'Pizza</span>, where every slice tells a story of passion and taste.</li>
          <br />
          <li>Since our inception on December 5, 2020, we've been dedicated to crafting the finest pizzas in Thirunelvely, Jaffna, Sri Lanka, using traditional cultural methods.</li>
          <br />
          <li>At O'Pizza, we pride ourselves on our commitment to authenticity and quality.</li>
          <br />
          <li>We do not use conventional ovens to bake our pizzas; instead, we employ <span style={{ color: 'red'}}>fire foods and cultural techniques</span> passed down through generations.</li>
        </ul>
        <br />

        <ul className="list-disc pl-8">
          <li>Nestled at <span style={{ color: 'red'}}>15/2, 10th Lane, Thalankavil Pillayar Road </span>, our cozy pizzeria offers a warm ambiance for dine-in guests.</li>
          <br />
          <li>We also cater to those on the go with our convenient take-away service.</li>
          <br />
          <li>However, our heart lies in delivery, as we strive to bring the irresistible flavors of O'Pizza to doorsteps across Jaffna city, all at no extra charge.</li>
          <br />
          <li>With a commitment to quality and satisfaction, we invite you to experience the essence of authentic pizza.</li>
          <br />
          <li>For inquiries or orders, simply reach out to us at <span style={{ color: 'red'}}>0777134777</span>.</li>
          <br />
          <li>O'Pizza - where every bite is a taste of perfection.</li>
        </ul>
      
      </div>
    </div>
  );
}

export default AboutUs;