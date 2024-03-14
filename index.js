const express = require('express');
const bodyParser = require('body-parser');
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const app = express();
const port = 3000;

const firebaseConfig = {
  apiKey: "AIzaSyBqwP3eeX6Z4g3ttYkM-lCaqbKACwWZacw",
  authDomain: "ckpnt-queue.firebaseapp.com",
  projectId: "ckpnt-queue",
  storageBucket: "ckpnt-queue.appspot.com",
  messagingSenderId: "940589892814",
  appId: "1:940589892814:web:4be2198c7665149ec47c9f"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML page for adding name to the queue
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Add Name to Queue</title>
      </head>
      <body>
        <h1>Add Your Name to the Queue</h1>
        <form id="queueForm" action="/queue" method="POST">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <button type="submit">Add to Queue</button>
        </form>
        <div id="queueList"></div>
        <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js"></script>
        <script>
          const firebaseConfig = ${JSON.stringify(firebaseConfig)};
          firebase.initializeApp(firebaseConfig);
          const db = firebase.firestore();

          const queueList = document.getElementById('queueList');

          // Function to fetch and display queue
          const fetchQueue = async () => {
            queueList.innerHTML = ''; // Clear previous queue
            const queueRef = db.collection('queue');
            const queueSnapshot = await queueRef.get();
            queueSnapshot.forEach(doc => {
              const queueItem = document.createElement('div');
              queueItem.textContent = doc.data().name;
              queueList.appendChild(queueItem);
            });
          };

          // Fetch and display queue on page load
          fetchQueue();

          // Submit form asynchronously
          document.getElementById('queueForm').addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            const name = document.getElementById('name').value;
            await db.collection('queue').add({ name });
            document.getElementById('name').value = ''; // Clear input field
            fetchQueue(); // Fetch and display updated queue
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
