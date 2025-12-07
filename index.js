require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL 

mongoose.connect(MONGO_URL)
  .then(() => console.log('Merge MA!'))
  .catch(err => console.error('Connection Error:', err));

app.use('/api/auth', require('./routes/User.routes.js'));
app.use('/api/posts', require('./routes/Post.routes'));


// Simple Test Route
app.get('/', (req, res) => {
    res.send('Rutele Merg Ma');
});

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));