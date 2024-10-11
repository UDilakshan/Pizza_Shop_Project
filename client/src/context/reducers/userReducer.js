
//const initialState = {
  //user: null
//};
const initialState = {
  uid: null,
  email: null,
  displayName: null,
  phoneNumber: null,
  address: null,
  photoURL: null,
  // other fields...
};

const userReducer = (state = initialState, action) => {

  switch(action.type){
     
      case "SET_USER":
        console.log('Payload received in reducer:', action.payload); // Add this line
        return {
          ...state,
          //...state.user,
          ...action.payload,
          
          /*user: action.payload,
          uid: action.payload.uid,
          email: action.payload.email,
          emailVerified: action.payload.emailVerified,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL,
          phoneNumber: action.payload.phoneNumber,
          address: action.payload.address,     
          user_name: action.payload.user_name,
          isAnonymous: action.payload.isAnonymous,
          providerData: action.payload.providerData,*/
    
        }
      
      case "GET_USER":
        return state;

      case "SET_USER_NULL":
          return action.user;

      default:
          return state;
  }
};

export default userReducer;
