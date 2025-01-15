const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbCluster = process.env.DATABASE_CLUSTER_URL;
const dbName = process.env.DATABASE_NAME;

// const authenticate = require('./middleware/authMiddleware')

const db = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(db)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch((e) => console.error('Error connecting to MongoDB:', e));


const assignmentRoutes = require('./routes/assignmentRoutes');
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');
const authRoutes = require('./routes/authRoutes')

//initialize Express app
const app = express();

//use cors for cross-origin resource sharing and body parser
app.use(cors());
app.use(bodyParser.json());

//test route
app.get('/', (req, res) => {
    res.send('API is running...');
});


//apply public routes
app.use('/api/auth', authRoutes)


// Apply authentication middleware globally
// app.use(authenticate);

// Private routes (require authentication)
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);





// Set the port
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
