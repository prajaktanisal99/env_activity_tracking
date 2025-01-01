import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import corsOptions from "./config/corsOptions.js";
import { connectDB } from "./config/dbConn.js";
import credentials from "./middleware/credentials.js";
import errorHandler from "./middleware/errorHandler.js";
import { logger } from "./middleware/logEvents.js";
import verifyJWT from "./middleware/verifyJWT.js";
import {
  activityRoutes,
  loginRoutes,
  logoutRoute,
  refreshRoute,
  registerRoutes,
  rootRoutes,
  userRoutes,
  volunteerRoutes,
} from "./routes/index.js";
const app = express();
const PORT = process.env.PORT || 3500;

// Get the current directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(logger); // Custom logger middleware
app.use(credentials); // Handle options credentials check - before CORS
app.use(cors(corsOptions)); // CORS middleware
app.use(helmet()); // Added security headers with Helmet
app.use(express.urlencoded({ extended: false })); // URL encoded form data
app.use(express.json()); // JSON body parser
app.use(cookieParser()); // Cookie parser

// Serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// Routes
app.use("/", rootRoutes); //index.html
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/refresh", refreshRoute);
app.use("/logout", logoutRoute);

// Protected routes
app.use(verifyJWT); // JWT verification middleware
app.use("/", userRoutes);

app.use("/activity", activityRoutes);
app.use("/volunteer", volunteerRoutes);

// Catch-all route for undefined routes (404)
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Global error handler middleware
app.use(errorHandler);

// Handle graceful shutdown
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed due to app termination");
    process.exit(0); // Exit the process after closing the DB connection
  });
});

// Start server once DB connection is open
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
