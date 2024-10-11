import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAProduct, editAProduct, getAllProducts } from "../api";
import { HiCurrencyRupee } from "../assets/icons";
import { alertNULL, alertSuccess } from "../context/actions/alertActions";
import { setAllProducts } from "../context/actions/productActions";
import DataTable from "./DataTable";
import { MainLoader } from "../components";
import EditProductDialog from "./EditProductDialog"; 

const DBItems = () => {
  //const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const products = useSelector((state) => state.products || []);


  useEffect(() => {
    getAllProducts().then((data) => {
      dispatch(setAllProducts(data));
    });
  }, [dispatch]);

  const handleEdit = (product) => {
    setProductToEdit(product);
    setEditDialogOpen(true);
  };

  const sortedProducts = (products || []).map(product => {
    // Create an array of price labels and their corresponding values
    const prices = [
      { label: 'smallPrice', value: product.smallPrice },
      { label: 'mediumPrice', value: product.mediumPrice },
      { label: 'largePrice', value: product.largePrice },
    ];
  
    // Sort the prices in ascending order
    prices.sort((a, b) => a.value - b.value);
  
    // Extract sorted values
    const [sortedSmallPrice, sortedMediumPrice, sortedLargePrice] = prices.map(p => p.value);
  
    return {
      ...product,
      smallPrice: sortedSmallPrice,
      mediumPrice: sortedMediumPrice,
      largePrice: sortedLargePrice,
    };
  });
  

  const handleEditSave = (updatedProduct) => {
    editAProduct(updatedProduct.productId, updatedProduct).then((res) => {
      if (res) {
        dispatch(alertSuccess("Product Updated Successfully"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        getAllProducts().then((data) => {
          dispatch(setAllProducts(data));
        });
      }
      setEditDialogOpen(false);
      setProductToEdit(null);
    });
  };

  if (!products) {
    return <MainLoader />;
  }

  return (
    <div className="flex flex-grow-0 items-center justify-self-center gap-5 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: "Image",
            field: "imageURL",
            render: (rowData) => (
              <img
                src={rowData.imageURL}
                className="w-14 h-14 object-contain rounded-xl"
                alt="product"
              />
            ),
          },
          {
            title: "Name",
            field: "name",
            render: (rowData) => (
              <p
                className="text-sm font-semibold text-black flex items-center justify-self-center"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {rowData.name}
              </p>
            ),
          },
          
          {
            title: "Category",
            field: "category",
            render: (rowData) => (
              <p
                className="text-sm font-semibold text-black flex items-center justify-self-center"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {rowData.category}
              </p>
            ),
          },

          {
            title: "UsualPrice",
            field: "usualPrice",
            render: (rowData) => (
              <p className="text-sm font-semibold text-textColor flex items-center justify-center ">
                <HiCurrencyRupee className="text-red-400" />
                {parseFloat(rowData.usualPrice).toFixed(2)}
              </p>
            ),
          },
          {
            title: "SmallPrice",
            field: "smallPrice",
            render: (rowData) => (
              <p className="text-sm font-semibold text-textColor flex items-center justify-center ">
                <HiCurrencyRupee className="text-red-400" />
                {parseFloat(rowData.smallPrice).toFixed(2)}
              </p>
            ),
          },
          {
            title: "MediumPrice",
            field: "mediumPrice",
            render: (rowData) => (
              <p className="text-sm font-semibold text-textColor flex items-center justify-center ">
                <HiCurrencyRupee className="text-red-400" />
                {parseFloat(rowData.mediumPrice).toFixed(2)}
              </p>
            ),
          },
          {
            title: "LargePrice",
            field: "largePrice",
            render: (rowData) => (
              <p className="text-sm font-semibold text-textColor flex items-center justify-center ">
                <HiCurrencyRupee className="text-red-400" />
                {parseFloat(rowData.largePrice).toFixed(2)}
              </p>
            ),
          },
          {
            title: "Description",
            field: "description",
            render: (rowData) => (
              <p
                className="text-xs font-semibold text-black flex items-center justify-self-center"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {rowData.description}
              </p>
            ),
          },
        ]}
        data={sortedProducts}
        title="List of Products"
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Data",
            onClick: (event, rowData) => handleEdit(rowData),
          },
          {
            icon: "delete",
            tooltip: "Delete Data",
            onClick: (event, rowData) => {
              if (window.confirm("Are you sure, you want to perform this action?")) {
                deleteAProduct(rowData.productId).then((res) => {
                  dispatch(alertSuccess("Product Deleted Successfully"));
                  setTimeout(() => {
                    dispatch(alertNULL());
                  }, 3000);
                  getAllProducts().then((data) => {
                    dispatch(setAllProducts(data));
                  });
                });
              }
            },
          },
        ]}
      />
      {editDialogOpen && (
        <EditProductDialog
          open={editDialogOpen}
          product={productToEdit}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default DBItems;
