import React, { useState, useEffect } from 'react';
import './App.css';

 // State variables for storing user input and the list of feedback
function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);

  // Function to fetch all feedback from the backend
  const fetchFeedback = async () => {
    const res = await fetch('/api/feedback'); // Send GET request to backend
    const data = await res.json(); // Convert response to JSON
    setFeedbackList(data); // Update state with feedback list
  };

  const handleSubmit = async (e) => {
    e.preventDefault();// Stop the page from reloading every time the feedback is submitted

    if (!name.trim() || !message.trim()) { // Check if name or message is empty after removing spaces

      alert('Please fill in both name and feedback.');
      return;
    }

    const newFeedback = {
      name,
      message,
      timestamp: `${new Date().toLocaleDateString()}, 
      ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`//current date and time


    };

const res = await fetch('/api/feedback', { // Send feedback to backend
  method: 'POST', // HTTP method to create new data
  headers: { 'Content-Type': 'application/json' }, // Tell server we're sending JSON
  body: JSON.stringify(newFeedback) // Convert JS object to JSON string
});

    const result = await res.json(); //Convert server's response to JS object

if (res.ok) { // If server response was successful
  setName(''); // Clear name input
  setMessage(''); // Clear message input
  fetchFeedback(); // Refresh feedback list
} else {
  alert(result.error || 'Something went wrong while submitting.'); // Show error if failed
}
};
  //delete feedback by ID
  const handleDelete = async (id) => {
    const res = await fetch(`/api/feedback/${id}`, {// Send delete request to backend
      method: 'DELETE'
    });

    const result = await res.json(); // Get server response

    if (res.ok) {
      alert(result.message); // Shows "Feedback deleted"
      fetchFeedback();//Refresh feedback list
    } else {
      alert('Failed to delete feedback.');
    }
  };
  // Fetch feedback list when page loads (runs once)
  useEffect(() => {
    fetchFeedback();
  }, []);
  
  // JSX: User interface
  return (
    <div className="container">
      <h2>Feedback Form</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}// Update name state on typing
        />
        <textarea
          placeholder="Your Feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}// Update message state on typing
        ></textarea>
        <button type="submit">Submit</button>
      </form>

      <h3>All Feedback</h3>
      <div className="feedback-list">
        {feedbackList.map((fb) => (// Loop through feedbacks
          <div key={fb.id} className="feedback-card">
            <div>
              <strong>{fb.name}</strong>
              <span className="timestamp">{fb.timestamp}</span>
              <p>{fb.message}</p>
            </div>
            <button onClick={() => handleDelete(fb.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
