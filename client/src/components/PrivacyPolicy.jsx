import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div
      className="privacy-policy-container"
      style={{
        padding: '40px 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        marginTop: '120px', 
        lineHeight: '1.6',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#333',
          marginBottom: '30px',
          fontWeight: '600',
        }}
      >
        Privacy Policy
      </h1>

      <p
        style={{
          fontSize: '1.1rem',
          color: '#555',
          textAlign: 'justify',
          marginBottom: '20px',
        }}
      >
        At Opizza, we value your privacy. This Privacy Policy document explains the
        types of personal data we collect and how it is used, stored, and protected.
      </p>

      <h2
        style={{
          fontSize: '1.6rem',
          color: '#333',
          marginBottom: '15px',
          borderBottom: '2px solid #f1f1f1',
          paddingBottom: '5px',
        }}
      >
        Information Collection
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#555',
          textAlign: 'justify',
          marginBottom: '20px',
        }}
      >
        We collect personal information when you use our services, such as when
        you place an order, register an account, or contact customer support. The
        types of information we may collect include:
      </p>
      <ul
        style={{
          fontSize: '1.1rem',
          color: '#555',
          marginLeft: '20px',
          marginBottom: '30px',
        }}
      >
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Billing address</li>
        <li>Payment information</li>
        <li>Order history</li>
      </ul>

      <h2
        style={{
          fontSize: '1.6rem',
          color: '#333',
          marginBottom: '15px',
          borderBottom: '2px solid #f1f1f1',
          paddingBottom: '5px',
        }}
      >
        How We Use Your Information
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#555',
          textAlign: 'justify',
          marginBottom: '20px',
        }}
      >
        We use the collected information to:
      </p>
      <ul
        style={{
          fontSize: '1.1rem',
          color: '#555',
          marginLeft: '20px',
          marginBottom: '30px',
        }}
      >
        <li>Process and fulfill your orders</li>
        <li>Provide customer support</li>
        <li>Send promotional offers and updates</li>
        <li>Improve our services</li>
      </ul>

      <h2
        style={{
          fontSize: '1.6rem',
          color: '#333',
          marginBottom: '15px',
          borderBottom: '2px solid #f1f1f1',
          paddingBottom: '5px',
        }}
      >
        Data Protection
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#555',
          textAlign: 'justify',
          marginBottom: '20px',
        }}
      >
        We take appropriate measures to ensure that your personal data is protected
        from unauthorized access, disclosure, or alteration. However, no method of
        transmission over the internet is 100% secure.
      </p>

      <h2
        style={{
          fontSize: '1.6rem',
          color: '#333',
          marginBottom: '15px',
          borderBottom: '2px solid #f1f1f1',
          paddingBottom: '5px',
        }}
      >
        Cookies
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#555',
          textAlign: 'justify',
          marginBottom: '20px',
        }}
      >
        We use cookies to improve your experience while using our website. Cookies
        help us remember your preferences and keep track of your orders.
      </p>

      <h2
        style={{
          fontSize: '1.6rem',
          color: '#333',
          marginBottom: '15px',
          borderBottom: '2px solid #f1f1f1',
          paddingBottom: '5px',
        }}
      >
        Your Rights
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#555',
          textAlign: 'justify',
          marginBottom: '20px',
        }}
      >
        You have the right to access, update, or delete your personal information at
        any time. If you have any questions about your data or wish to exercise your
        rights, please contact us at{' '}
        <a href="mailto:opizzashop@gmail.com" style={{ color: '#0066cc' }}>
          opizzashop@gmail.com
        </a>.
      </p>

      <h2
        style={{
          fontSize: '1.6rem',
          color: '#333',
          marginBottom: '15px',
          borderBottom: '2px solid #f1f1f1',
          paddingBottom: '5px',
        }}
      >
        Changes to This Privacy Policy
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#555',
          textAlign: 'justify',
          marginBottom: '20px',
        }}
      >
        We may update this Privacy Policy from time to time. We will notify you of any
        changes by posting the updated policy on this page.
      </p>

      <h2
        style={{
          fontSize: '1.6rem',
          color: '#333',
          marginBottom: '15px',
          borderBottom: '2px solid #f1f1f1',
          paddingBottom: '5px',
        }}
      >
        Contact Us
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#555',
          textAlign: 'justify',
          marginBottom: '20px',
        }}
      >
        If you have any questions or concerns about our Privacy Policy, please reach
        out to us at{' '}
        <a href="mailto:opizzashop@gmail.com" style={{ color: '#0066cc' }}>
          opizzashop@gmail.com
        </a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
