import React from "react";

const FAQs = () => {
  const faqStyles = {
    container: {
      padding: "60px 20px 20px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    question: {
      fontWeight: "bold",
      fontSize: "18px",
      marginTop: "15px",
    },
    answer: {
      fontSize: "16px",
      lineHeight: "1.6",
      marginTop: "5px",
    },
  };

  return (
    <div style={faqStyles.container}>
      <h1 style={faqStyles.heading}>Frequently Asked Questions</h1>

      {/* FAQ 1 */}
      <div>
        <p style={faqStyles.question}>1. What payment methods do you accept?</p>
        <p style={faqStyles.answer}>
          We only accept **Cash on Delivery** at the moment. You can pay the
          delivery person directly when you receive your order.
        </p>
      </div>

      {/* FAQ 2 */}
      <div>
        <p style={faqStyles.question}>2. Can I customize my pizza?</p>
        <p style={faqStyles.answer}>
          Yes! You can customize your pizza with your favorite toppings. Simply
          select the customization option while placing your order.
        </p>
      </div>

      {/* FAQ 3 */}
      <div>
        <p style={faqStyles.question}>3. How long does delivery take?</p>
        <p style={faqStyles.answer}>
          Our delivery time is approximately **30-45 minutes**, depending on
          your location and order volume.
        </p>
      </div>

      {/* FAQ 4 */}
      <div>
        <p style={faqStyles.question}>
          4. What areas do you deliver to?
        </p>
        <p style={faqStyles.answer}>
          We currently deliver to all areas within Jaffna. If you're outside
          this region, contact us to check if we can deliver to your location.
        </p>
      </div>

      {/* FAQ 5 */}
      <div>
        <p style={faqStyles.question}>
          5. What should I do if my order is late?
        </p>
        <p style={faqStyles.answer}>
          If your order is delayed, please call us at **+94 123 456 789**. We'll
          ensure your pizza gets to you as soon as possible!
        </p>
      </div>

      {/* FAQ 6 */}
      <div>
        <p style={faqStyles.question}>
          6. Can I cancel or modify my order after placing it?
        </p>
        <p style={faqStyles.answer}>
          You can cancel or modify your order within 5 minutes of placing it by
          calling us at **+94 123 456 789**. After that, preparation might have
          already started.
        </p>
      </div>
    </div>
  );
};

export default FAQs;
