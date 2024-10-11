export const setUserDetails = (userData) => {
    return {
      type: "SET_USER",
      payload:userData,
    };
  };
  
  
  export const getUserDetails = () => {
    return {
      type: "GET_USER",
    };
  };
  
  export const setUserNull = () => {
    return {
      type: "SET_USER_NULL",
      user: null,
    };
  };
  