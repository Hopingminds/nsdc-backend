require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const userRouter = require('./router/user.router');
const userCart = require('./router/cart.router');
const batchRouter=require('./router/batch.router');
const assesmentRouter=require('./router/assesment.router')
const app = express();

const corsOptions = {
  origin: ['http://localhost:3001', 'https://your-frontend-domain.com','http://localhost:5173'], // Add your frontend URLs here
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed methods
  allowedHeaders: 'Content-Type,Authorization,x-csrf-token',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json());


// Routes
app.use('/api/users', userRouter);
app.use('/api/cart', userCart);
app.use('/api/batch', batchRouter);
app.use('/api/assesment', assesmentRouter);
// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});