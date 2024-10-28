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

const colorMap = {
<<<<<<< HEAD
  Complaint: "red",
  Contact: "blue",
  Appreciation: "green",
  "Order Inquiry": "orange",
=======
  Complaint: 'red',
  Contact: 'blue',
  Appreciation: 'green',
  "Order Inquiry": 'orange'
>>>>>>> 6e5e27911ed4bb2099ba05ddb882c0a84bde5f24
};

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
<<<<<<< HEAD
        feedbackList.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
=======
        
        // Sort feedbackList by timestamp in descending order
        feedbackList.sort((a, b) => {
          const dateA = a.timestamp?.seconds || 0;
          const dateB = b.timestamp?.seconds || 0;
          return dateB - dateA;
        });

>>>>>>> 6e5e27911ed4bb2099ba05ddb882c0a84bde5f24
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
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return "Invalid date";
  };

  return feedbacks.length ? (
    <div className="flex flex-col items-center gap-5 pt-6 w-full">
      {/* <h2 className="text-lg font-bold mb-4">User Feedbacks</h2> */}
      <DataTable
        columns={[
<<<<<<< HEAD
          { title: "User Name", field: "userName", render: (rowData) => <p className="text-md">{rowData.userName}</p> },
          { title: "Email", field: "email", render: (rowData) => <p className="text-md">{rowData.email}</p> },
          { title: "Date", field: "timestamp", render: (rowData) => <p className="text-md">{formatDate(rowData.timestamp)}</p> },
          { title: "Feedback Type", field: "feedbackType", render: (rowData) => <p style={{ color: colorMap[rowData.feedbackType] || 'black' }}>{rowData.feedbackType}</p> },
          { title: "Feedback", field: "message", render: (rowData) => <p>{rowData.message.length > 15 ? `${rowData.message.substring(0, 15)}...` : rowData.message}</p> },
          { title: "Actions", field: "actions", render: (rowData) => (
              <div className="flex gap-2">
                <button onClick={() => handleView(rowData)} className="text-blue-500 hover:text-blue-700"><FaEye /></button>
                <button onClick={() => handleDelete(rowData.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
=======
          {
            title: "User Name",
            field: "userName",
            render: (rowData) => (
              <p className="text-sm text-black flex items-center justify-self-center">
                {rowData.userName}
              </p>
            ),
          },
          {
            title: "Email",
            field: "email",
            render: (rowData) => (
              <p className="text-sm text-black flex items-center justify-self-center">
                {rowData.email}
              </p>
            ),
          },
          {
            title: "Date",
            field: "timestamp",
            render: (rowData) => (
              <p className="text-sm  text-black flex items-center justify-self-center">
                {formatDate(rowData.timestamp)}
              </p>
            ),
          },
          {
            title: "Feedback Type",
            field: "feedbackType",
            render: (rowData) => (
              <p
                className="text-sm  text-black flex items-center justify-self-center"
                style={{ color: colorMap[rowData.feedbackType] || 'black' }}
              >
                {rowData.feedbackType}
              </p>
            ),
          },
          {
            title: "Feedback",
            field: "message",
            render: (rowData) => (
              <p className="text-xs text-black flex items-center justify-self-center">
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
>>>>>>> 6e5e27911ed4bb2099ba05ddb882c0a84bde5f24
              </div>
            ) 
          }
        ]}
        data={feedbacks.map((feedback) => ({
          ...feedback,
          userName: `${feedback.fname} ${feedback.lname}`,
<<<<<<< HEAD
=======
          timestamp: feedback.timestamp,
>>>>>>> 6e5e27911ed4bb2099ba05ddb882c0a84bde5f24
          feedbackType: feedback.feedbackType || "Contact",
        }))}
        title="User Feedbacks"
      />
      {viewDialogOpen && selectedFeedback && (
<<<<<<< HEAD
        <Dialog open={viewDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle style={{ backgroundColor: '#fff0f8', color: '#333' }}> {/* Title color */}
              Feedback Details
          </DialogTitle>
          
          <DialogContent className="custom-popup">
              <p style={{ color: 'red', marginBottom: '1.2rem' }}>
                  <strong>User Name:</strong> 
                  <span style={{ color: 'black' }}>{`${selectedFeedback.fname} ${selectedFeedback.lname}`}</span>
             </p>
              <p style={{ color: 'red', marginBottom: '1.2rem' }}>
                  <strong>Email:</strong> 
                  <span style={{ color: 'black' }}>{selectedFeedback.email}</span>
             </p>
              <p style={{ color: 'red', marginBottom: '1.2rem' }}>
                  <strong>Date:</strong> 
                  <span style={{ color: 'black' }}>{formatDate(selectedFeedback.timestamp)}</span>
             </p>
              <p style={{ color: 'red', marginBottom: '1.2rem' }}>
                 <strong>Feedback Type:</strong> 
                 <span style={{ color: colorMap[selectedFeedback.feedbackType] || 'black' }}>{selectedFeedback.feedbackType || "Contact"}</span>
            </p>
              <p style={{ color: 'red', marginBottom: '0.3rem' }}>  
                  <strong>Feedback:</strong>
            </p>
              <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", color: 'black', marginBottom: '1.2rem' }}>{selectedFeedback.message}</p>
        </DialogContent>


          <DialogActions style={{ backgroundColor: '#fff0f8', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} color="primary">Close</Button>
=======
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
            <p><strong style={{ color: 'red' }}>Date:</strong> <span style={{ color: 'black' }}>{formatDate(selectedFeedback.timestamp)}</span></p>
            <p><strong style={{ color: 'red' }}>Feedback Type:</strong> <span style={{ color: colorMap[selectedFeedback.feedbackType] || 'black' }}>{selectedFeedback.feedbackType || "Contact"}</span></p>
            <p><strong style={{ color: 'red' }}>Feedback:</strong></p>
            <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", color: 'black' }}>{selectedFeedback.message}</p>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
>>>>>>> 6e5e27911ed4bb2099ba05ddb882c0a84bde5f24
          </DialogActions>
        </Dialog>
      )}
    </div>
  ) : (
    <MainLoader />
  );
};

export default DBFeedback;
