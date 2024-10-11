import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

const EditProductDialog = ({ open, product, onClose, onSave }) => {
  const [updatedProduct, setUpdatedProduct] = useState({
    ...product,
    usualPrice: product.usualPrice || "0.00",
    smallPrice: product.smallPrice || "0.00",
    mediumPrice: product.mediumPrice || "0.00",
    largePrice: product.largePrice || "0.00",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUpdatedProduct({
      ...product,
      usualPrice: product.usualPrice || "0.00",
      smallPrice: product.smallPrice || "0.00",
      mediumPrice: product.mediumPrice || "0.00",
      largePrice: product.largePrice || "0.00",
    });
  }, [product]);

  const handleChangePrices = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validate numeric input with optional decimal (allowing only one dot)
    if (/^\d*\.?\d*$/.test(newValue) || newValue === "") {
      setUpdatedProduct({ ...updatedProduct, [name]: newValue || "0.00" });
      setErrors({ ...errors, [name]: "" });
    } else {
      setErrors({ ...errors, [name]: "Invalid input. Please enter a valid number." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleSave = () => {
    onSave(updatedProduct);
  };

  const handleClose = () => {
    onClose();
    setUpdatedProduct(product); // Reset to original product on close
    setErrors({}); // Clear any validation errors
  };

  const isPizzaCategory = ["Veg Pizza", "Non Veg Pizza", "Premium Non Veg"].includes(updatedProduct.category);
  const isSpecialCategory = ["OPizza Offers", "Starters", "Desserts", "Drinks"].includes(updatedProduct.category);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="text-black font-bold flex items-center justify-center text-2xl">Edit Product</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={updatedProduct.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="category"
          label="Category"
          type="text"
          fullWidth
          value={updatedProduct.category}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="usualPrice"
          label="Usual Price"
          type="text"
          fullWidth
          value={updatedProduct.usualPrice}
          onChange={handleChangePrices}
          error={!!errors.usualPrice}
          helperText={errors.usualPrice}
          disabled={isPizzaCategory}
        />
        <TextField
          margin="dense"
          name="smallPrice"
          label="Small Price"
          type="text"
          fullWidth
          value={updatedProduct.smallPrice}
          onChange={handleChangePrices}
          error={!!errors.smallPrice}
          helperText={errors.smallPrice}
          disabled={isSpecialCategory}
        />
        <TextField
          margin="dense"
          name="mediumPrice"
          label="Medium Price"
          type="text"
          fullWidth
          value={updatedProduct.mediumPrice}
          onChange={handleChangePrices}
          error={!!errors.mediumPrice}
          helperText={errors.mediumPrice}
          disabled={isSpecialCategory}
        />
        <TextField
          margin="dense"
          name="largePrice"
          label="Large Price"
          type="text"
          fullWidth
          value={updatedProduct.largePrice}
          onChange={handleChangePrices}
          error={!!errors.largePrice}
          helperText={errors.largePrice}
          disabled={isSpecialCategory}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          value={updatedProduct.description}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
