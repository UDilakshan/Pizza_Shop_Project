const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require('dotenv').config();
const db = admin.firestore();

// Initialize app if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

// Get the app password and sender email from environment variables
//const appPassword = process.env.APP_PASSWORD; 
//const senderEmail = process.env.SENDER_EMAIL;

router.post("/create", async (req, res) => {
    /*if (!appPassword || !senderEmail) {
        return res.status(500).send({
            success: false,
            msg: "App password or sender email is missing. Please ensure they are set in the .env file.",
        });
    }*/

    const id = Date.now();
    const data = {
        orderId: id,
        name: req.body.name,
        user_id: req.body.user_id,
        carts: req.body.cart,
        email: req.body.email,
        address: req.body.addressNo,
        address1: req.body.address1,
        address2: req.body.address2,
        phone: req.body.phone,
        sts: "preparing",
        total: req.body.total,
    };

    console.log("Order data received:", req.body);

    // Save order to Firestore
    try {
        await db.collection("orders").doc(`/${id}/`).set(data);
        console.log("Order saved successfully.");
    } catch (firestoreError) {
        console.error("Error saving order to Firestore:", firestoreError);
        return res.status(500).send({ success: false, msg: `Error saving order to Firestore: ${firestoreError.message}` });
    }

    // Generate order items list
    let itemsList = req.body.cart.map(item => {
        return `<li><b>${item.name}</b> - Quantity: ${item.quantity}</li>`;
    }).join(""); 

    // Send Confirmation Email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'opizzashop@gmail.com',
            pass: 'kcow dhto ptla wnll',
        },
        tls: {
            rejectUnauthorized: false,
        },
       // port: 465,
       // host: 'smtp.gmail.com',
       // secure: true,
    });

    const mailOptions = {
        from: 'smtp.gmail.com',
        to: req.body.email, 
        subject: "Order Confirmation",
        html: `
             <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd;">
            <!-- Header Section -->
            <h1 style="text-align: center; color: #333; margin-bottom: 10px;">Your order is on its way.</h1>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/035/873/904/small/online-delivery-service-concept-online-order-tracking-delivery-home-and-office-scooter-courier-isometric-concept-goods-shipping-food-online-ordering-illustration-in-flat-style-vector.jpg" alt="Shipping Truck" style="width: 150px; height: auto;">
            </div>
            <p style="text-align: center; color: #555; font-weight: 600; margin-bottom: 20px;">
                    Take a quick peek at your order details.


            <!-- Order Summary -->
            <div style="display: flex; justify-content: space-between; border-top: 2px solid #eee; padding-top: 10px;">
                <div style="width: 50%;">
                    <h3 style="margin: 0 0 5px; color: #333;">SUMMARY:</h3>
                    <p style="margin: 0;"><b>Order #:</b> ${id}</p>
                    <p style="margin: 0;"><b>Order Date:</b> ${new Date().toDateString()}</p>
                    <p style="margin: 0;"><b>Order Total:</b> Rs.${req.body.total}</p>
                </div>
                <!-- Shipping Address -->
                <div style="width: 45%;">
                    <h3 style="margin: 0 0 5px; color: #333;">SHIPPING ADDRESS:</h3>
                    <p style="margin: 0;"><b>${req.body.name}</b></p>
                    <p style="margin: 0;">${req.body.addressNo}</p>
                    <p style="margin: 0;">${req.body.address1}</p>
                    <p style="margin: 0;">${req.body.address2}</p>
                </div>
            </div>
            
            <!-- Footer -->
            <p style="text-align: center; color: #fff; background: linear-gradient(to bottom, #444, #000); padding: 10px; margin-top: 20px; font-size: 14px; border-radius: 5px;">
                     Good vibes and great food are in transit! Get ready to savor every bite. 🛵🔥🍔
            </p>

        </div>
    `,
};
    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Confirmation email sent successfully.");
    } catch (mailError) {
        console.error("Error sending confirmation email:", mailError);
        return res.status(500).send({ success: false, msg: `Error sending confirmation email: ${mailError.message}` });
    }

    // Return success response
    return res.status(200).send({ success: true, msg: "Order created and email sent." });
});

module.exports = router;