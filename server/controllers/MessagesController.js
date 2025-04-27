import cloudinary from "../lib/cloudinary.js";
import Message from "../models/MessagesModel.js";


export const getMessages = async (request, response, next) => {
    try {
        const user1 = request.userId 
        const user2 = request.body.id 
        // console.log(`user1: ${user1} and user2: ${user2}`);
        if(!user1 || !user2){
            return response.status(400).send("Both user ID are required")
        }
        const messages = await Message.find({
            $or: [
                {sender: user1, recipient: user2},
                {sender: user2, recipient: user1}
            ]
        }).sort({timestamp: 1})
    //    console.log( "show from getMessages function",{messages});
       return response.status(200).json({messages})
    } catch (error) {
        console.log('Error From getMessages function   function Messages Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}
// with multer
// export const uploadFile = async (request, response, next) => {
//     try {
//        if(!request.file){
//         return response.status(400).send('File is required')
//        }
//        const date = Date.now()
//        let fileDir = `uploads/files/${date}`;
//        let fileName = `${fileDir}/${request.file.originalname}`;
//        mkdirSync(fileDir, {recursive: true})
//        renameSync(request.file.path, fileName)


//     //    console.log({fileName}, "show from upload file function ");
//        return response.status(200).json({filePath: fileName})
//     } catch (error) {
//         console.log('Error From upload file function   function Messages Controller',error);
//         return response.status(500).send("Internal Server Error");
        
//     }
// }
// with cloudinary 


export const uploadFile = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).send('File is required');
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(request.file.path, {
      folder: "files", // cloudinary er vitor 'files' folder e jabe
      resource_type: "auto", // important! because files can be images, pdfs, etc.
    });

    // result.secure_url => cloudinary file url
    return response.status(200).json({
      filePath: result.secure_url,  // frontend e pathabo
      publicId: result.public_id,   // optional: future delete er jonno
    });

  } catch (error) {
    console.log('Error From upload file function in Messages Controller', error);
    return response.status(500).send("Internal Server Error");
  }
};