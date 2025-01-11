const cartReducer =(state=null,action)=>{
  switch (action.type){
      case "GET_CART_ITEMS":
      return state;

      case "SET_CART_ITEMS":
          return action.items;

      case "CLEARCART_ITEMS": 
              return [];
              
      case 'UPDATE_PRODUCT_PRICE':
    return state.map((item) =>
      item.productId === action.payload.productId
        ? { ...item, usualPrice: action.payload.newPrice }
        : item
    );

      default:
          return state;
  }
};
export default cartReducer;