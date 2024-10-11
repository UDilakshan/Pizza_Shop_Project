// EditUserDialog.js
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const EditUserDialog = ({ open, user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState(user || {});

  useEffect(() => {
    setEditedUser(user || {});
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (editedUser) {
      onSave(editedUser);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="displayName"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editedUser.displayName || ""}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editedUser.email || ""}
          onChange={handleChange}
        />
        <TextField
          label="Verified"
          name="emailVerified"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editedUser.emailVerified || ""}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
