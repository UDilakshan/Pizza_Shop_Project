const initialState = {
  uid: null,
  email: null,
  displayName: null,
  phoneNumber: null,
  address: null,
  photoURL: null,
  
};

const userReducer = (state = initialState, action) => {

  switch(action.type){
     
      case "SET_USER":
        console.log('Payload received in reducer:', action.payload); // Add this line
        return {
          ...state,
          ...action.payload,
    
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
