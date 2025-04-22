import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/AuthRoutes.js'
import morgan from 'morgan'
import contactsRoutes from './routes/ContactRoute.js'
import setupSocket from './socket.js'

dotenv.config();
const app = express()
const port = process.env.PORT || 3000
const databaseURL = process.env.MONGODB_URI 
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}))
app.use('/uploads/profiles', express.static("uploads/profiles"))
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'))
app.use('/api/auth', authRoutes)
app.use('/api/contacts',contactsRoutes)
const server = app.listen(port, () => {
    console.log('Server is running port', port);
})
setupSocket(server)
mongoose.connect(databaseURL).then(() =>  console.log('DB Connected successful')).catch((err) => console.log(err.message))
