const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Logging middleware
app.use(morgan("dev"));

// Body parsing middleware
app.use(express.json());

// Add a custom middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Auth and API routes
app.use("/auth", require("./auth"));
app.use("/api", require("./api"));
app.use("/create-payment-intent", require("./api/payment"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public/index.html"))
);

// Static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "public")));

// Handle requests with an extension (.js, .css, etc.) - send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

// Send index.html for any remaining requests
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/index.html"));
});

module.exports = app;
