import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AiOutlineSend } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const chatEndRef = useRef(null);

  const handleOptionClick = (option) => {
    const userMessage = { text: option, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    let botReply;

    switch (option) {
      case "See Categories":
        botReply = "These are our categories: Veg Pizza, Non-Veg Pizza, Premium Non-Veg, Starters, Desserts, Drinks.";
        break;
      case "See Recommended Items":
        botReply = "Here are some recommended items: Jaffna Mix Topping, Beef Pepperoni, Hot Butter Mushroom, Choco Bread, BBQ Pizza, Cheese Garlic Bread";
        break;
      case "Add Complaint or Inquiry":
        botReply = "Please go to the Contact Us page to submit your complaint or inquiry.";
        break;
      case "Contact OPizza":
        botReply = `You can contact OPizza at:\n Phone: +94 777134777   \n  Email: opizzashop@gmail.com`;
        break;
      case "See Offers":
        botReply = "We have offers starting from 1999/=, 2499/=, 2999/=. For more details, check out the offer items on the homepage.";
        break;
      case "Location":
        botReply = "You can find us at this location: https://maps.app.goo.gl/bsn3BgkRqAiap26v6";
        break;
      default:
        botReply = "I'm here to help! Let me know what you need.";
    }

    const botResponse = { text: botReply, sender: "OPizza Bot" };
    setMessages((prev) => [...prev, botResponse]);

    // Clear options after clicking
    setCurrentOptions([]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
  
    const userMessage = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
  
    let botReply;
    let options = [];
    const lowerInput = inputMessage.toLowerCase();
  
    if (lowerInput.includes("menu")) {
      botReply = "Here are some categories: Veg Pizza, Non-Veg Pizza, Premium Non-Veg, Starters, Desserts, Drinks.";
    } else if (lowerInput.includes("recommended")) {
      botReply = "Here are some recommended items:\n Jaffna Mix Topping\n Beef Pepperoni\n Hot Butter Mushroom\n-Choco Bread\n BBQ Pizza\n Cheese Garlic Bread";
    } else if (lowerInput.includes("complain") || lowerInput.includes("inquiry")) {
      botReply = "Please go to the Contact Us page to submit your complaint or inquiry.";
    } else if (lowerInput.includes("contact")) {
      botReply = `You can contact OPizza at:\n- Phone: +94 777134777\n Email: opizzashop@gmail.com\n Address: 15/2, 10th Lane, Thalankavil Pillayar Road`;
    } else if (lowerInput.includes("offers")) {
      botReply = "We have offers starting from 1999/=, 2499/=, 2999/=. For more details, check out the offer items on the homepage.";
    } else if (lowerInput.includes("location")) {
      botReply = "You can find us at this location: https://maps.app.goo.gl/bsn3BgkRqAiap26v6";
    } else if (lowerInput.includes("hi") || lowerInput.includes("hello")) {
      botReply = "Hello! Welcome to OPizza! How can I assist you today?";
    } else if (
      lowerInput.includes("thanks") ||
      lowerInput.includes("thankyou") ||
      lowerInput.includes("thank you")
    ) {
      botReply = "You're welcome! Enjoy your day!";
      // Do not show options after a thank-you message
      setInputMessage("");
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: botReply, sender: "OPizza Bot" }]);
      }, 1000);
      return;
    } else {
      botReply = "I'm here to help! Let me know what you need.";
    }
  
    const botResponse = { text: botReply, sender: "OPizza Bot" };
    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
      setCurrentOptions([
        "See Categories",
        "See Recommended Items",
        "Add Complain or Inquiry",
        "Contact OPizza",
        "See Offers",
        "Location",
      ]);
    }, 1000);
  
    setInputMessage("");
  };
  
  const closeOptions = () => {
    setCurrentOptions([]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    setCurrentOptions([]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isChatOpen ? (
        <motion.div
          className="bg-white shadow-lg w-72 h-[500px] rounded-lg flex flex-col"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
            <span>OPizza Chatbot</span>
            <div className="flex items-center">
              <button onClick={handleClearChat} className="text-white mr-2">
                <AiOutlineDelete size={20} />
              </button>
              <button onClick={() => setIsChatOpen(false)} className="text-white">
                ✖
              </button>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
              key={idx}
              className={`p-2 my-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-100 self-end"
                  : "bg-gray-200 self-start"
              }`}
              style={{
                wordWrap: "break-word", // Ensures long text breaks into new lines
                overflowWrap: "break-word", // Provides fallback for older browsers
              }}
            >
              {msg.text}
            </div>
            
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-2 border-t">
            {currentOptions.length > 0 && (
              <div className="flex flex-col space-y-2 mb-2">
                {currentOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    className="bg-blue-500 text-white px-2 py-1 text-sm rounded-md"
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={closeOptions}
                  className="bg-red-500 text-white px-2 py-1 text-sm rounded-md mt-2"
                >
                  Close Options
                </button>
              </div>
            )}
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 p-2 rounded-lg border"
                placeholder="Type your message..."
                disabled={currentOptions.length > 0}
              />
              <button onClick={handleSendMessage} className="ml-2 text-blue-500">
                <AiOutlineSend size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <button
          className="bg-blue-500 text-white p-3 rounded-full"
          onClick={() => setIsChatOpen(true)}
        >
          <FiMessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
