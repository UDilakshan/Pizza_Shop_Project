const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// Create a product
router.post('/create', async (req, res) => {
    try {
        const id = Date.now();
        const data = {
            productId: id,
            name: req.body.name,
            imageURL: req.body.imageURL,
            category: req.body.category,
            usualPrice: req.body.usualPrice,
            smallPrice: req.body.smallPrice,
            mediumPrice: req.body.mediumPrice,
            largePrice: req.body.largePrice,
            description: req.body.description,
        };

        const response = await db.collection("products").doc(`/${id}/`).set(data);
        console.log(response);
        return res.status(200).send({ success: true, data: response });
    } catch (err) {
        return res.send({ success: false, msg: `Error: ${err}` });
    }
});

// Get all products
router.get("/all", async (req, res) => {
    try {
        let query = db.collection("products");
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



// Delete a product
router.delete("/delete/:productId", async (req, res) => {
    const productId = req.params.productId;
    try {
        await db.collection("products").doc(`/${productId}/`).delete();
        return res.status(200).send({ success: true });
    } catch (err) {
        return res.send({ success: false, msg: `Error: ${err}` });
    }
});

// Update a product
router.put("/update/:productId", async (req, res) => {
    const productId = req.params.productId;
    const updatedData = req.body;

    try {
        await db.collection("products").doc(`/${productId}/`).update(updatedData);
        return res.status(200).send({ success: true, data: updatedData });
    } catch (err) {
        return res.send({ success: false, msg: `Error: ${err}` });
    }
});

// Add to cart
router.post("/addToCart/:userId", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.productId;

    try {
        const doc = await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .get();

        if (doc.data()) {
            const quantity = doc.data().quantity + 1;
            const updatedItem = await db
                .collection("cartItems")
                .doc(`/${userId}/`)
                .collection("items")
                .doc(`/${productId}/`)
                .update({ quantity });
            return res.status(200).send({ success: true, data: updatedItem });
        } else {
            const data = {
                productId: productId,
                name: req.body.name,
                imageURL: req.body.imageURL,
                category: req.body.category,
                usualPrice: req.body.usualPrice,
                smallPrice: req.body.smallPrice,
                mediumPrice: req.body.mediumPrice,
                largePrice: req.body.largePrice,
                description: req.body.description,
                quantity: 1,
            };
            const addItems = await db
                .collection("cartItems")
                .doc(`/${userId}/`)
                .collection("items")
                .doc(`/${productId}/`)
                .set(data);
            return res.status(200).send({ success: true, data: addItems });
        }
    } catch (err) {
        return res.send({ success: false, msg: `Error: ${err}` });
    }
});

// Update cart to increase and decrease the quantity
router.post("/updateCart/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    const productId = req.query.productId;
    const type = req.query.type;

    try {
        const doc = await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .get();

        if (doc.data()) {
            if (type === "increment") {
                const quantity = doc.data().quantity + 1;
                const updatedItem = await db
                    .collection("cartItems")
                    .doc(`/${userId}/`)
                    .collection("items")
                    .doc(`/${productId}/`)
                    .update({ quantity });
                return res.status(200).send({ success: true, data: updatedItem });
            } else {
                if (doc.data().quantity === 1) {
                    await db
                        .collection("cartItems")
                        .doc(`/${userId}/`)
                        .collection("items")
                        .doc(`/${productId}/`)
                        .delete()
                        .then((result)=>{
                    return res.status(200).send({ success: true, data:result });
                        });
                } else {
                    const quantity = doc.data().quantity - 1;
                    const updatedItem = await db
                        .collection("cartItems")
                        .doc(`/${userId}/`)
                        .collection("items")
                        .doc(`/${productId}/`)
                        .update({ quantity });
                    return res.status(200).send({ success: true, data: updatedItem });
                }
            }
        }
    } catch (err) {
        return res.send({ success: false, msg: `Error: ${err}` });
    }
});

// Get all cart items for a user
router.get("/getCartItems/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    try {
        let query = db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items");
        let response = [];

        await query.get().then((querysnap) => {
            let docs = querysnap.docs;

            docs.map((doc) => {
                response.push({ ...doc.data() });
            });
            return response;
        });
        return res.status(200).send({ success: true, data: response });
    } catch (err) {
        return res.send({ success: false, msg: `Error: ${err}` });
    }
});


//orders
/*router.get("/orders", async (req, res) => {
    try {
        let query = db.collection("product") + db.collection("userId");
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
});*/

module.exports = router;
