import React from "react";

const FAQs = () => {
  return (
    <div className="p-8 max-w-3xl mt-36 mx-auto font-sans">
      <h1 className="text-center text-2xl font-bold mb-6">
        Frequently Asked Questions
      </h1>

      {/* FAQ 1 */}
      <div>
        <p className="font-bold text-lg mt-4">
          1. What payment methods do you accept?
        </p>
        <p className="text-base leading-relaxed mt-2">
          We only accept <strong>Cash on Delivery</strong> at the moment. You can pay the
          delivery person directly when you receive your order.
        </p>
      </div>

      {/* FAQ 2 */}
      <div>
        <p className="font-bold text-lg mt-4">2. Can I customize my pizza?</p>
        <p className="text-base leading-relaxed mt-2">
          Yes! You can customize your pizza with your extra cheese. Simply
          select the customization option while placing your order.
        </p>
      </div>

      {/* FAQ 3 */}
      <div>
        <p className="font-bold text-lg mt-4">
          3. How long does delivery take?
        </p>
        <p className="text-base leading-relaxed mt-2">
          Our delivery time is approximately <strong>30-45 minutes</strong>, depending on
          your location and order volume.
        </p>
      </div>

      {/* FAQ 4 */}
      <div>
        <p className="font-bold text-lg mt-4">
          4. What areas do you deliver to?
        </p>
        <p className="text-base leading-relaxed mt-2">
          We currently deliver to all areas within Jaffna. If you're outside
          this region, contact us to check if we can deliver to your location.
        </p>
      </div>

      {/* FAQ 5 */}
      <div>
        <p className="font-bold text-lg mt-4">
          5. What should I do if my order is late?
        </p>
        <p className="text-base leading-relaxed mt-2">
          If your order is delayed, please call us at <strong>+94 777134777</strong>. We'll
          ensure your pizza gets to you as soon as possible!
        </p>
      </div>

      {/* FAQ 6 */}
      <div>
        <p className="font-bold text-lg mt-4">
          6. Can I cancel or modify my order after placing it?
        </p>
        <p className="text-base leading-relaxed mt-2">
          You can cancel or modify your order within 5 minutes of placing it by
          calling us at <strong>+94 777134777</strong>. After that, preparation might have
          already started.
        </p>
      </div>
    </div>
  );
};

export default FAQs;
