import mongoose from 'mongoose'
import {hash, genSalt} from 'bcrypt'
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'password is Required'],
        unique: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
    type: String,
    required: false,
    },
    image: {
        type: String,
        required: false,
    },
    colors: {
        type: Number,

        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
})
userSchema.pre("save", async function(next) {
    const salt = await genSalt()
    this.password = await hash(this.password, salt)
    console.log('From user model page', this.password);
    next()
})
const User = mongoose.model("Users", userSchema)
export default User