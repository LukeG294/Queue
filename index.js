const express = require('express');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require('serviceAccountKey.json'); // Path to your service account key JSON file
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com' // Replace with your Firebase project URL
});

const db = firebaseAdmin.firestore();

app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML page for adding name to the queue
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Add Name to Queue</title>
      </head>
      <body>
        <h1>Add Your Name to the Queue</h1>
        <form action="/queue" method="POST">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <button type="submit">Add to Queue</button>
        </form>
      </body>
    </html>
  `);
});

// Route to get the queue
app.get('/queue', async (req, res) => {
  try {
    const queueSnapshot = await db.collection('queue').get();
    const queue = [];
    queueSnapshot.forEach(doc => {
      queue.push(doc.data().name);
    });
    res.json(queue);
  } catch (error) {
    console.error('Error getting queue:', error);
    res.status(500).json({ error: 'Failed to get queue' });
  }
});

// Route to add a name to the queue
app.post('/queue', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    await db.collection('queue').add({ name });
    res.redirect('/');
  } catch (error) {
    console.error('Error adding to queue:', error);
    res.status(500).json({ error: 'Failed to add to queue' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
