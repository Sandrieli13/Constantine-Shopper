const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// API routes
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

// Serve index.html
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes

  // Provide a detailed error message in the response
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
