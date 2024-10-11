const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();


router.post('/create', async (req, res) => {
    try {
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

        console.log('tes>>>>',data)

        const response = await db.collection("orders").doc(`/${id}/`).set(data);
        console.log(response);
        return res.status(200).send({ success: true, data: response });
    } catch (err) {
        return res.send({ success: false, msg: `Error: ${err}` });
    }
});

router.get("/all", async (req, res) => {
    try {
        let query = db.collection("orders");
        let response = [];
        await query.get().then((querysnap) => {
            let docs = querysnap.docs;
            docs.forEach((doc) => {
                response.push({ ...doc.data() });
            });
        });
        return res.status(200).send({ success: true, data: response });
    } catch (err) {
        return res.send({ success: false, msg: `Error: ${err}` });
    }
});


module.exports = router;
