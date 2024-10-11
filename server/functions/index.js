const functions = require("firebase-functions");
const admin = require("firebase-admin");
require('dotenv').config();
const serviceAccountKey=require("./serviceAccountKey.json");

const express=require("express");
const app=express();

//Body parser for our json data
app.use(express.json());

//cross origin
const cors=require("cors");
app.use(cors({origin:true}));
app.use((req,res,next)=>{
    res.set("Access-Control-Allow-Origin","*");
    next();
})
//firebase credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });


//Api endpoinnts
app.get("/",(req,res)=>{
    return res.send("hello world");
})
// User routes
const userRoute = require('./routes/user');


app.use("/api/users", userRoute);

const productRoute = require("./routes/products");
app.use("/api/products/", productRoute);

const orderRoute = require("./routes/order");
app.use("/api/orders/", orderRoute);

// Export the Express app as a Cloud Function
exports.app = functions.https.onRequest(app);
 