import axios from "axios";

/* When we wanna deploy our project we just want to change the URL only */
export const baseURL = "http://127.0.0.1:5001/restaurant-app-80ba6/us-central1/app";

// Validate JWT Token
export const validateUserJWTToken = async (token) => {
    try {
        const res = await axios.get(`${baseURL}/api/users/jwtVerfication`, {
            headers: { Authorization: "Bearer " + token },
        });
        return res.data.data;
    } catch (err) {
        console.error("Error validating JWT token:", err);
        return null;
    }
};

// Add New Product
export const addNewProduct = async (data) => {
    try {
        const res = await axios.post(`${baseURL}/api/products/create`, { ...data });
        return res.data.data;
    } catch (err) {
        return null;
    }
};


export const clearCartItems = async (user_id) => {
    try {
      const response = await fetch(`/api/clearCart/${user_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      return response.ok;
    } catch (error) {
      console.error("Error clearing cart in API:", error);
      return false;
    }
  };

  
// Add New Order
export const addNeworder = async (data) => {
    try {
        const res = await axios.post(`${baseURL}/api/orders/create`, { ...data });
        console.log(res.data.data);
        return res.data.data;
    } catch (err) {
        console.error("Ërror:",err);
        return null;
    }
};

// Get All Products
export const getAllProducts = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/products/all`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};



// Delete a Product
export const deleteAProduct = async (productId) => {
    try {
        const res = await axios.delete(`${baseURL}/api/products/delete/${productId}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};


export const deleteOrder = async (orderId) => {
    try {
        const res = await axios.delete(`${baseURL}/api/orders/delete/${orderId}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};



// Edit a Product
export const editAProduct = async (productId, data) => {
    try {
        const res = await axios.put(`${baseURL}/api/products/update/${productId}`, data);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

// Get All Users
export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/users/all`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};



// Get All Orders
export const getAllOrder = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/orders/all`);
        const numberedOrders = res.data.data.reverse().map((order, index) => ({
            ...order,
            orderNumber: index + 1,
        }));
        return numberedOrders;
    } catch (err) {
        return null;
    }
};

//update the order status
export const updateOrderSts = async (order_id, sts) => {
    try {
        const res = await axios.post(
            `${baseURL}/api/products/updateOrder/${order_id}`,null,
            {params: { sts: sts}}
        );
        return res.data.data;
    } catch (error) {
        return null;
    }
}



// Add New Item to Cart
export const addNewItemToCart = async (user_id, data) => {
    try {
        const res = await axios.post(
            `${baseURL}/api/products/addToCart/${user_id}`,
            { ...data }
        );
        return res.data.data;
    } catch (error) {
        return null;
    }
};



// Get All Cart Items
export const getAllCartItems = async (user_id) => {
    try {
      const res = await axios.get(`${baseURL}/api/products/getCartItems/${user_id}`);
      console.log("Cart items fetched:", res.data.data); // Check the structure here
      return res.data.data;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return null;
    }
  };


// Increase Item Quantity
export const increaseItemQuantity = async (user_id, productId, type) => {
    try {
        const res = await axios.post(
            `${baseURL}/api/products/updateCart/${user_id}`,
            null,
            { params: { productId, type } }
        );
        return res.data.data;
    } catch (error) {
        return null;
    }
};



// Get User Orders (New Function)
// In api/index.js
export const getUserOrders = async (userId) => {
  try {
    const res = await axios.get(`${baseURL}/api/orders/user/${userId}`);
    return res.data.data;
  } catch (err) {
    return null;
  }
};


// Example of a delete function
export const deleteUser = (userId) => {
    return axios.delete(`/api/users/${userId}`);
};


// Example of an update function
export const updateUser = (userId, updatedUserData) => {
    return axios.put(`/api/users/${userId}`, updatedUserData);
};

