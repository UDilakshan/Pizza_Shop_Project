import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { firestore } from "../firebase.config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { DataTable } from "../components";
import { alertNULL, alertSuccess } from "../context/actions/alertActions";
import { MainLoader } from "../components";
import { FaTrash, FaEye } from "react-icons/fa";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import "./DBFeedback.css"; 

const DBFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Feedbacks"));
        const feedbackList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
                // Sort feedbackList by timestamp in descending order
        feedbackList.sort((a, b) => {
          const dateA = a.timestamp?.seconds || 0;
          const dateB = b.timestamp?.seconds || 0;
          return dateB - dateA;
        });

        setFeedbacks(feedbackList);
      } catch (error) {
        console.error("Error fetching feedbacks: ", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure, you want to perform this action?")) {
      try {
        await deleteDoc(doc(firestore, "Feedbacks", id));
        dispatch(alertSuccess("Feedback Deleted Successfully"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
      } catch (error) {
        console.error("Error deleting feedback: ", error);
      }
    }
  };

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setViewDialogOpen(true);
  };

  const handleClose = () => {
    setViewDialogOpen(false);
    setSelectedFeedback(null);
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString();
    }
    return "Invalid date";
  };

  if (!feedbacks.length) {
    return <MainLoader />;
  }

  return (
    <div className="flex flex-grow-0 items-center justify-self-center gap-5 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: "User Name",
            field: "userName",
            render: (rowData) => (
              <p className="text-sm font-semibold text-black flex items-center justify-self-center">
                {rowData.userName}
              </p>
            ),
          },
          {
            title: "Email",
            field: "email",
            render: (rowData) => (
              <p className="text-sm font-semibold text-black flex items-center justify-self-center">
                {rowData.email}
              </p>
            ),
          },
          //{
            //title: "Phone Number",
           // field: "phonenumber",
           // render: (rowData) => (
            //  <p className="text-sm font-semibold text-black flex items-center justify-self-center">
            //</p>     {<rowData className="phonenumber"></rowData> }  {/* Display 'N/A' if phoneno is not present */}
           //  </div> </p>
          //  ),
        //  },
          {
            title: "Date",
            field: "timestamp",
            render: (rowData) => (
              <p className="text-sm font-semibold text-black flex items-center justify-self-center">
                {formatDate(rowData.timestamp)}
              </p>
            ),
          },
          {
            title: "Feedback Type",
            field: "feedbackType",
            render: (rowData) => (
              <p className="text-sm font-semibold text-black flex items-center justify-self-center">
                {rowData.feedbackType}
              </p>
            ),
          },
          {
            title: "Feedback",
            field: "message",
            render: (rowData) => (
              <p className="text-xs font-semibold text-black flex items-center justify-self-center">
                {rowData.message.length > 15
                  ? `${rowData.message.substring(0, 15)}...`
                  : rowData.message}
              </p>
            ),
          },
          {
            title: "Actions",
            field: "actions",
            render: (rowData) => (
              <div className="flex gap-4">
                <button
                  onClick={() => handleView(rowData)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDelete(rowData.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ),
          },
        ]}
        data={feedbacks.map((feedback) => ({
          ...feedback,
          userName: `${feedback.fname} ${feedback.lname}`,
         // phoneno: <feedback className="phonenumber"></feedback>,  // Ensure this matches the Firestore field name
          timestamp: feedback.timestamp,
          feedbackType: feedback.feedbackType || "Contact",
        }))}
        title="User Feedbacks"
      />

      {viewDialogOpen && selectedFeedback && (
        <Dialog
          open={viewDialogOpen}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          classes={{ paper: "custom-dialog" }} 
        >
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogContent>
            <p><strong style={{ color: 'red' }}>User Name:</strong> <span style={{ color: 'black' }}>{`${selectedFeedback.fname} ${selectedFeedback.lname}`}</span></p>
            <p><strong style={{ color: 'red' }}>Email:</strong> <span style={{ color: 'black' }}>{selectedFeedback.email}</span></p>
           {/*} <p><strong style={{ color: 'red' }}>Phone Number:</strong> <span style={{ color: 'black' }}>{selectedFeedback.phonenumber }</span></p> */}
            <p><strong style={{ color: 'red' }}>Date:</strong> <span style={{ color: 'black' }}>{formatDate(selectedFeedback.timestamp)}</span></p>
            <p><strong style={{ color: 'red' }}>Feedback Type:</strong> <span style={{ color: 'black' }}>{selectedFeedback.feedbackType || "Contact"}</span></p>
            <p><strong style={{ color: 'red' }}>Feedback:</strong></p>
            <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", color: 'black' }}>{selectedFeedback.message}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default DBFeedback;
