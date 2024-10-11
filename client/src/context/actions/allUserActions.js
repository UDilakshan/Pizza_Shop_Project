export const setAllUserDetails = (user) =>{
    return {
        type : "SET_ALL_USER",
        allUsers: user,
    }
};

export const getAllUserDetails = (user) =>{
    return{
        type : "GET_ALL_USER"
    }
};

/*export const removeUserFromStore = (userId) => ({
    type: 'REMOVE_USER',
    payload: userId,
  });
  
  export const updateUserInStore = (updatedUserData) => ({
    type: 'UPDATE_USER',
    payload: updatedUserData,
  });*/