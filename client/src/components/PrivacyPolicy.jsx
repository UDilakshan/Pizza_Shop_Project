import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container mx-auto mt-36 max-w-5xl p-5 font-sans leading-relaxed mb-16">
      <h1 className="text-center text-4xl font-semibold text-gray-800 mb-8">Privacy Policy</h1>

      <p className="text-lg text-gray-600 text-justify mb-5">
        At Opizza, we value your privacy. This Privacy Policy document explains the types of personal
        data we collect and how it is used, stored, and protected.
      </p>

      <h2 className="text-2xl text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Information Collection</h2>
      <p className="text-lg text-gray-600 text-justify mb-5">
        We collect personal information when you use our services, such as when you place an order,
        register an account, or contact customer support. The types of information we may collect
        include:
      </p>
      <ul className="list-disc list-inside text-lg text-gray-600 mb-8 ml-5">
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Billing address</li>
        <li>Payment information</li>
        <li>Order history</li>
      </ul>

      <h2 className="text-2xl text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">How We Use Your Information</h2>
      <p className="text-lg text-gray-600 text-justify mb-5">We use the collected information to:</p>
      <ul className="list-disc list-inside text-lg text-gray-600 mb-8 ml-5">
        <li>Process and fulfill your orders</li>
        <li>Provide customer support</li>
        <li>Send promotional offers and updates</li>
        <li>Improve our services</li>
      </ul>

      <h2 className="text-2xl text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Data Protection</h2>
      <p className="text-lg text-gray-600 text-justify mb-5">
        We take appropriate measures to ensure that your personal data is protected from unauthorized
        access, disclosure, or alteration. However, no method of transmission over the internet is
        100% secure.
      </p>

      <h2 className="text-2xl text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Cookies</h2>
      <p className="text-lg text-gray-600 text-justify mb-5">
        We use cookies to improve your experience while using our website. Cookies help us remember
        your preferences and keep track of your orders.
      </p>

      <h2 className="text-2xl text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Your Rights</h2>
      <p className="text-lg text-gray-600 text-justify mb-5">
        You have the right to access, update, or delete your personal information at any time. If you
        have any questions about your data or wish to exercise your rights, please contact us at{' '}
        <a href="mailto:opizzashop@gmail.com" className="text-blue-600">
          opizzashop@gmail.com
        </a>
        .
      </p>

      <h2 className="text-2xl text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Changes to This Privacy Policy</h2>
      <p className="text-lg text-gray-600 text-justify mb-5">
        We may update this Privacy Policy from time to time. We will notify you of any changes by
        posting the updated policy on this page.
      </p>

      <h2 className="text-2xl text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Contact Us</h2>
      <p className="text-lg text-gray-600 text-justify mb-5">
        If you have any questions or concerns about our Privacy Policy, please reach out to us at{' '}
        <a href="mailto:opizzashop@gmail.com" className="text-blue-600">
          opizzashop@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
