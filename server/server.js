const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000; //port number where our backend will run

app.use(cors());
app.use(express.json());

let feedbackList = []; //Array for feedback storage in memory

//post request
app.post('/api/feedback', (req, res) => {
  const { name, message, timestamp } = req.body;

  //if name or message is missing, send an error

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
   
  //new feedback object
  const newFeedback = {
    id: Date.now(), //unique ID based on current time
    name,
    message,
    timestamp
  };
  
  //Add new feedback to the list
  feedbackList.push(newFeedback);
  res.status(201).json({feedback: newFeedback });
});

//Get request
app.get('/api/feedback', (req, res) => {
  res.json(feedbackList);
});
// Route to delete a feedback
app.delete('/api/feedback/:id', (req, res) => {
  const id = parseInt(req.params.id); //Convert ID from string to number

  // Keep all feedback except the one whose ID matches the ID we want to delete
  feedbackList = feedbackList.filter(fb => fb.id !== id);
  res.json({ message: 'Feedback deleted' });
});

app.listen(PORT, () => {  // Start the server and listen for requests
 console.log("Server running on http://localhost:" + PORT); //shows that server has statrted

});
