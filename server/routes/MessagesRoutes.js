import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url'; // Import for ES Modules
import { mkdirSync } from "fs";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = dirname(__filename); // Get the directory name

// Create temporary folder if not exists
const tempFolder = path.join(__dirname, '../uploads/temp');
mkdirSync(tempFolder, { recursive: true }); // Ensure the folder exists

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempFolder); // Temporary folder where files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Adding timestamp to avoid filename conflicts
  }
});

const upload = multer({ storage });

const messagesRoutes = Router();

messagesRoutes.post('/get-messages', verifyToken, getMessages);
messagesRoutes.post('/upload-file', verifyToken, upload.single("file"), uploadFile); // File upload route

export default messagesRoutes;