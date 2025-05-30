import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'
import { compare } from 'bcrypt'
// import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../lib/cloudinary.js';
// const __filename = fileURLToPath(import.meta.url);


// create jwt token for validate 
const maxAge = 3 * 24 * 60 * 60 *1000
const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge})
}
// when user sign up then this function work

export const signup = async(request, response, next) => {
    try {
        const {email, password} = request.body
        // console.log('show from sign up page authcontroller', email, password);
        if(!email || !password){
            return response.status(400).send("Email and Password are Required")

        }
        const user = await User.create({email, password});
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development'

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
        // console.log('show from sign up page authcontroller', email, password);
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
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development'

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
export const getUserInfo = async (request, response, next) => {
    try {
        // console.log(request.userId, 'get user function');
        
        const userData = await User.findById(request.userId);
        if(!userData){
            return  response.status(500).send("User with the given id not found")
        }
        
        return response.status(200).json({    
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
            image: userData.image,
                color: userData.color
           })
    } catch (error) {
        console.log('Error From Get userData Info function Auth Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}
export const updateProfile = async (request, response, next) => {
    try {
        // find id from token  
        const {userId} = request
        const {firstName, lastName, color} = request.body
        if(!firstName || !lastName ){
            return response.status(400).send('First Name, Last Name and Color Required')
        }
        const userData = await User.findByIdAndUpdate(userId, {firstName, lastName, color, profileSetup: true}, {new: true, runValidators: true})
       
        
        return response.status(200).json({    
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color
           })
    } catch (error) {
        console.log('Error From Get profile update  function Auth Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}
// export const addProfileImage = async (request, response, next) => {
//     try {
//           if(!request.file){
//             return response.status(400).send('File is Required')

//           }
//           const date = Date.now()
//           let fileName = 'uploads/profiles/' + date + request.file.originalname
//           renameSync(request.file.path, fileName)
//           const updateUser = await User.findByIdAndUpdate(request.userId, {image: fileName}, {new: true, runValidators: true})
//         //   console.log(updateUser.image, 'add profile image');
//         return response.status(200).json({    
//                 image: updateUser.image,
                
//            })
//     } catch (error) {
//         console.log('Error From add  profile update  function Auth Controller',error);
//         return response.status(500).send("Internal Server Error");
        
//     }
// }
// export const removeProfileImage = async (request, response, next) => {
//     try {
//         const {userId} = request
//         const user = await User.findById(userId)
//         if(!user){
//             return response.status(400).send('User Not Found')
//         }
//        if(user.image){
//         unlinkSync(user.image)
//        }
//         user.image = null;
//         await user.save()
//        return response.status(200).send('Profile image removed successfully')
//     } catch (error) {
//         console.log('Error From Get profile update  function Auth Controller',error);
//         return response.status(500).send("Internal Server Error");
        
//     }
// }

export const addProfileImage = async (request, response, next) => {
    try {
      if (!request.file) {
        return response.status(400).send("File is Required");
      }
  
      // Upload file to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "profiles", // Cloudinary এর মধ্যে profiles নামে ফোল্ডার হবে
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
  
        uploadStream.end(request.file.buffer);
      });
  
      // Save image URL to Database
      const updateUser = await User.findByIdAndUpdate(
        request.userId,
        { image: result.secure_url }, // Cloudinary এর URL save হবে
        { new: true, runValidators: true }
      );
  
      return response.status(200).json({
        image: updateUser.image, // Return the uploaded image URL
      });
    } catch (error) {
      console.log("Error From add profile update function Auth Controller", error);
      return response.status(500).send("Internal Server Error");
    }
  };
// export const removeProfileImage = async (request, response, next) => {
//   try {
//     const { userId } = request;
//     const user = await User.findById(userId);

//     if (!user) {
//       return response.status(400).send('User Not Found');
//     }

//     if (user.image) {
//       const filePath = path.join(__dirname, '../uploads/profiles', path.basename(user.image));

//       if (existsSync(filePath)) {
//         unlinkSync(filePath);
//       }
//     }

//     user.image = null;
//     await user.save();
//     return response.status(200).send('Profile image removed successfully');
    
//   } catch (error) {
//     console.log('Error From Get profile update function Auth Controller', error);
//     return response.status(500).send('Internal Server Error');
//   }
// };
export const removeProfileImage = async (request, response, next) => {
    try {
      const { userId } = request;
      const user = await User.findById(userId);
  
      if (!user) {
        return response.status(400).send('User Not Found');
      }
  
      if (user.image) {
        // Extract public_id from Cloudinary URL
        const parts = user.image.split('/');
        const fileName = parts[parts.length - 1]; // Example: abcdxyz.png
        const publicId = 'profiles/' + fileName.split('.')[0]; // Remove extension
  
        // Destroy from cloudinary
        await cloudinary.uploader.destroy(publicId);
      }
  
      user.image = null;
      await user.save();
      return response.status(200).send('Profile image removed successfully');
      
    } catch (error) {
      console.log('Error From remove profile image function', error);
      return response.status(500).send('Internal Server Error');
    }
  };
export const logout = async (request, response, next) => {
    try {
       response.cookie("jwt", "", {maxAge: 1, secure: true, sameSites: 'None'})
       return response.status(200).send('Logout successfully')
    } catch (error) {
        console.log('Error From Get profile update  function Auth Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}