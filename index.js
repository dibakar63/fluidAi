const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv=require('dotenv');
const registerRoutes = require('./controller');
const cors=require('cors');
dotenv.config();
const app = express();
const port = 6000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://dibakardey63:QcGlGmtwkZ4PzopS@recipes.rglhoml.mongodb.net/fluidAi', {
    
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Routes
app.use('/api', registerRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
