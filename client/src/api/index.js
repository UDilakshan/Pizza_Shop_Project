import axios from "axios";

/* When we wanna deploy our project we just want to change the URL only */
 export const baseURL = "http://127.0.0.1:5001/restaurant-app-80ba6/us-central1/app";


 
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

//add new products
export const addNewProduct = async (data) =>{
    try{
        const res = await axios.post(`${baseURL}/api/products/create`, {...data});
         return res.data.data;
    }
    catch(err){
        return null;
    }
};

export const addNeworder = async (data) => {
  try{
      const res = await axios.post(`${baseURL}/api/orders/create`,{...data});

      console.log(res.data)
      return res.data.data
  }catch(err){
      return null;
  }
} 


// get all the products
export const getAllProducts = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/products/all`);
      return res.data.data;
    } catch (err) {
      return null;
    }
  };



// delete a product
export const deleteAProduct = async (productId) => {
    try {
      const res = await axios.delete(`${baseURL}/api/products/delete/${productId}`);
      return res.data.data;
    } catch (err) {
      return null;
    }
  };


// Edit a product
export const editAProduct = async (productId, data) => {
  try {
    const res = await axios.put(`${baseURL}/api/products/update/${productId}`, data);
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getAllUsers = async () => {
  try{
    const res = await axios.get(`${baseURL}/api/users/all`);
    return res.data.data;
  }catch (err){
      return null;
  }
};

export const getAllOrder = async () => {
  try{
    const res = await axios.get(`${baseURL}/api/orders/all`);
    return res.data.data;
  }catch(err){
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



// Example of a delete function
export const deleteUser = (userId) => {
  return axios.delete(`/api/users/${userId}`);
};

// Example of an update function
export const updateUser = (userId, updatedUserData) => {
  return axios.put(`/api/users/${userId}`, updatedUserData);
};

export const softDeleteUser = async (userId) => {
  try {
    const response = await axios.put(`${baseURL}/api/users/soft-delete/${userId}`, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    return response.data.data; // Adjust based on your API response structure
  } catch (error) {
    console.error('Error soft deleting user:', error);
    throw error;
  }
};