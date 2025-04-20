import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'
import { compare } from 'bcrypt'
// create jwt token for validate 
const maxAge = 3 * 24 * 60 * 60 *1000
const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge})
}
// when user sign up then this function work

export const signup = async(request, response, next) => {
    try {
        const {email, password} = request.body
        console.log('show from sign up page authcontroller', email, password);
        if(!email || !password){
            return response.status(400).send("Email and Password are Required")

        }
        const user = await User.create({email, password});
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSites: "None",

        })
           return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
           })
           
    } catch (error) {
        console.log('Error From AuthController', error);
        return response.status(500).send("Internal Server Error")
    }
}
export const login = async(request, response, next) => {
    try {
        const {email, password} = request.body
        console.log('show from sign up page authcontroller', email, password);
        if(!email || !password){
            return response.status(400).send("Email and Password are Required")

        }
        const user = await User.findOne({email});
        if(!user){
            return response.status(404).send("User of this email not found")
        }
        const auth = await compare(password,  user.password)
        if(!auth){
            return response.status(404).send("Password is Incorrect")
        }
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSites: "None",

        })
           return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            }
           })
           
    } catch (error) {
        console.log('Error From AuthController', error);
        return response.status(500).send("Internal Server Error")
    }
}
export const getUserInfo = async () => {
    try {
        
    } catch (error) {
        console.log('Error From Get user Info function Auth Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}