import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import morgan from 'morgan';
import contactsRoutes from './routes/ContactRoute.js';
import setupSocket from './socket.js';
import messagesRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';
import path from 'path';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();
const databaseURL = process.env.MONGODB_URI;

app.use(cors({
  origin: ["https://my-react-real-time-chat.onrender.com", "http://localhost:5173"],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// Static files for uploads
app.use('/uploads/profiles', express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/channel', channelRoutes);

// Production static files handling
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.all('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

// Start the server
const server = app.listen(port, () => {
  console.log('Server is running on port', port);
});

// Set up socket.io
setupSocket(server);

// MongoDB connection
mongoose.connect(databaseURL)
  .then(() => console.log('DB Connected successfully'))
  .catch((err) => console.log('DB Connection Error:', err.message));
