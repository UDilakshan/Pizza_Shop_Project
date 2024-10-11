import { combineReducers } from "redux";
import alertReducer from "./alertReducer"
import userReducer from "./userReducer";
import productReducer from "./productReducer"
import allUserReducer from "./allUserReducer";
import cartReducer from "./cartReducer";
import displaycartReducer from "./displaycartReducer";
import orderReducer from "./orderReducer";


const myReducers = combineReducers({
  user: userReducer,
  alert: alertReducer,
  products: productReducer,
  allUsers : allUserReducer,
  cart:cartReducer,
  isCart: displaycartReducer,
  orders:orderReducer,
  
});

export default myReducers;
