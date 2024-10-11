import React, { useEffect, useState } from 'react';
import { DataTable, MainLoader } from '../components';
import { firestore } from '../firebase.config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FaEye } from 'react-icons/fa';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { alertSuccess, alertDanger, alertNULL } from "../context/actions/alertActions";

const ProFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserFeedbacks = async () => {
      setLoading(true);
      setError("");

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const feedbackCollection = collection(firestore, 'Feedbacks');
          const querySnapshot = await getDocs(feedbackCollection);

          if (querySnapshot.empty) {
            setError("No feedback found.");
            setFeedbacks([]);
            return;
          }

          const feedbackList = querySnapshot.docs
            .map(doc => {
              const data = doc.data();
              const timestamp = data.timestamp.toDate();
              return {
                id: doc.id,
                date: timestamp.toLocaleDateString(),
                time: timestamp.toLocaleTimeString(),
                feedbackType: data.feedbackType.name || data.feedbackType || "N/A",
                feedback: data.message || "No feedback provided",
                email: data.email,
                fname: data.fname || 'N/A',
                lname: data.lname || 'N/A',
                timestamp: timestamp
              };
            })
            .filter(feedback => feedback.email === user.email);

          setFeedbacks(feedbackList);
        } else {
          setError("User is not authenticated.");
        }
      } catch (error) {
        setError("Error fetching feedbacks.");
        console.error("Error fetching feedbacks: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure, you want to perform this action?")) {
      try {
        console.log(`Deleting feedback with ID: ${id}`); 
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

  const handleDeleteAll = async () => {
    const confirmation = window.confirm("Are you sure you want to delete all selected feedbacks?");
    if (confirmation) {
      try {
        console.log("Deleting all selected feedbacks:", selectedFeedbacks); 
        const deletePromises = selectedFeedbacks.map(id => deleteDoc(doc(firestore, "Feedbacks", id)));
        await Promise.all(deletePromises);
        setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => !selectedFeedbacks.includes(feedback.id)));
        setSelectedFeedbacks([]);
        console.log("Selected feedbacks deleted successfully."); 
        dispatch(alertSuccess("Selected feedbacks deleted successfully"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } catch (error) {
        console.error("Error deleting selected feedbacks: ", error); 
        dispatch(alertDanger("Error deleting selected feedbacks.")); 
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
    return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
  };

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedFeedbacks(feedbacks.map(fb => fb.id));
            } else {
              setSelectedFeedbacks([]);
            }
          }}
          checked={selectedFeedbacks.length === feedbacks.length}
        />
      ),
      field: "select",
      render: rowData => (
        <input
          type="checkbox"
          checked={selectedFeedbacks.includes(rowData.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedFeedbacks([...selectedFeedbacks, rowData.id]);
            } else {
              setSelectedFeedbacks(selectedFeedbacks.filter(id => id !== rowData.id));
            }
          }}
        />
      )
    },
    { title: "Date", field: "date" },
    { title: "Time", field: "time" },
    {
      title: "Feedback Type",
      field: "feedbackType",
      render: rowData => {
        const colorMap = {
          Complaint: 'red',
          Contact: 'blue',
          Appreciation: 'green',
          "Order Inquiry": 'orange'
        };
        const color = colorMap[rowData.feedbackType?.name || rowData.feedbackType] || 'black';
        return <span style={{ color }}>{rowData.feedbackType?.name || rowData.feedbackType}</span>;
      },
    },
    {
      title: "Feedback",
      field: "feedback",
      render: rowData => rowData.feedback.length > 25 ? `${rowData.feedback.substring(0, 25)}...` : rowData.feedback,
    },
    {
      title: "Actions",
      field: "actions",
      render: rowData => (
        <div className="flex items-center space-x-2">
          < FaEye className="cursor-pointer" onClick={() => handleView(rowData)} />
        </div>
      ),
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-6 w-full">
      {loading && <MainLoader />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <DataTable
            title="My Feedbacks"
            columns={columns}
            data={feedbacks}
            options={{
              paging: false,
              search: false,
              showTitle: false,
            }}
          />

          {selectedFeedbacks.length > 0 && (
            <div className="flex justify-end items-center mt-4 w-full">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteAll}
                disabled={!selectedFeedbacks.length}
              >
                Delete selected
              </Button>
            </div>
          )}
        </>
      )}

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
            <p><strong style={{ color: 'red' }}>Date:</strong> <span style={{ color: 'black' }}>{formatDate(selectedFeedback.timestamp)}</span></p>
            <p><strong style={{ color: 'red' }}>Feedback Type:</strong> <span style={{ color: 'black' }}>{selectedFeedback.feedbackType || "Contact"}</span></p>
            <p><strong style={{ color: 'red' }}>Feedback:</strong></p>
            <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", color: 'black' }}>
              {selectedFeedback.feedback}
            </p>
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

export default ProFeedback;
