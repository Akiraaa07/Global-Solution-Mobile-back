const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
 
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const aparelhosRoutes = require('./routes/aparelhosRoutes');
 
const app = express();
 
app.use(cors());
app.use(bodyParser.json());
 
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/aparelhos', aparelhosRoutes);
 
module.exports = app;