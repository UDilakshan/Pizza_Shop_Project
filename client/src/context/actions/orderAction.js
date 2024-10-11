export const setOrders =(data) =>{
    return {
        type: "SET_ORDERS",
        orders: data,
    };
};

export const groupedDataetOrders =(data) =>{
    return {
        type: "GET_ORDERS",
    };
};