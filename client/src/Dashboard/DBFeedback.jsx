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
  Complaint: "red",
  Contact: "blue",
  Appreciation: "green",
  "Order Inquiry": "orange",
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
        feedbackList.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
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
          { title: "User Name", field: "userName", render: (rowData) => <p className="text-md">{rowData.userName}</p> },
          { title: "Email", field: "email", render: (rowData) => <p className="text-md">{rowData.email}</p> },
          { title: "Date", field: "timestamp", render: (rowData) => <p className="text-md">{formatDate(rowData.timestamp)}</p> },
          { title: "Feedback Type", field: "feedbackType", render: (rowData) => <p style={{ color: colorMap[rowData.feedbackType] || 'black' }}>{rowData.feedbackType}</p> },
          { title: "Feedback", field: "message", render: (rowData) => <p>{rowData.message.length > 15 ? `${rowData.message.substring(0, 15)}...` : rowData.message}</p> },
          { title: "Actions", field: "actions", render: (rowData) => (
              <div className="flex gap-2">
                <button onClick={() => handleView(rowData)} className="text-blue-500 hover:text-blue-700"><FaEye /></button>
                <button onClick={() => handleDelete(rowData.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
              </div>
            ) 
          }
        ]}
        data={feedbacks.map((feedback) => ({
          ...feedback,
          userName: `${feedback.fname} ${feedback.lname}`,
          feedbackType: feedback.feedbackType || "Contact",
        }))}
        title="User Feedbacks"
      />
      {viewDialogOpen && selectedFeedback && (
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
          </DialogActions>
        </Dialog>
      )}
    </div>
  ) : (
    <MainLoader />
  );
};

export default DBFeedback;