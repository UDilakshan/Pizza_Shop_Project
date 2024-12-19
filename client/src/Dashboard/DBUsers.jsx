import React, { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../api';
import { setAllUserDetails } from '../context/actions/allUserActions';
import { Avatar } from '@mui/material';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DBUsers = () => {
  const allUsers = useSelector((state) => state.allUsers || []);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (allUsers.length === 0) {
      getAllUsers()
        .then((data) => {
          dispatch(setAllUserDetails(data));
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch users', error);
          setLoading(false);
        });
    } else {
      const uniqueUsers = allUsers.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.email === user.email)
      );
      setUniqueUsers(uniqueUsers);
      setLoading(false);
    }
  }, [allUsers, dispatch]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (userId) => {
    console.log('Deleting user with ID:', userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-grow-0 items-center justify-self-center gap-5 pt-6 w-full">
      <DataTable
        columns={[
          // {
          //   title: 'Image',
          //   field: 'photoURL',
          //   render: (rowData) => (
          //     <img
          //       src={rowData.photoURL ? rowData.photoURL : Avatar}
          //       className="w-14 h-14 object-contain rounded-xl"
          //       alt="User"
          //     />
          //   ),
          // },
          {
            title: 'Name',
            field: 'displayName',
          },
          {
            title: 'Email',
            field: 'email',
          },
          {
            title: 'Verified',
            field: 'emailVerified',
            render: (rowData) => (
              <p
                className={`px-2 py-1 w-32 text-center text-primary rounded-md ${
                  rowData.emailVerified ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              >
                {rowData.emailVerified ? 'Verified' : 'Not Verified'}
              </p>
            ),
          },
          {
            title: 'Actions',
            field: 'actions',
            render: (rowData) => (
              <div className="flex gap-2">
                <IconButton onClick={() => handleEdit(rowData)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(rowData.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ),
          },
        ]}
        data={uniqueUsers}
        title="List of Users"
      />
      {isEditModalOpen && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setEditModalOpen(false)}
          onSave={(updatedUser) => {
            // Here, update the user details in the state or dispatch an action to update in the Redux store
            setEditModalOpen(false);
            console.log('Updated User:', updatedUser);
          }}
        />
      )}
    </div>
  );
};

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          className="mb-4 border p-2 w-full"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 border p-2 w-full"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DBUsers;
