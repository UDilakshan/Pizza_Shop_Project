export const setCartItems=(items)=>{
  return {
      type:"SET_CART_ITEMS",
      items: items,

};
};
export const getCartItems =()=>{
  return{
      type:"GET_CART_ITEMS",
  };
};


export const clearCart =()=>{
  return{
      type:"CLEARCART_ITEMS",
   
  };
};


export const updateProductPrice = (productId, newPrice) => {
  return {
    type: 'UPDATE_PRODUCT_PRICE',
    payload: {
      productId,
      newPrice,
    },
  };
};
