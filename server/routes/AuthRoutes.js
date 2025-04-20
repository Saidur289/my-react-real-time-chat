import { getUserInfo, login, signup, updateProfile } from "../controllers/AuthControllers.js"
import{Router} from 'express'
import { verifyToken } from "../middlewares/AuthMiddleware.js"
const authRoutes = Router()
authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.get('/user-info',verifyToken,  getUserInfo)
authRoutes.post('/update-profile', verifyToken, updateProfile)
export default authRoutes;