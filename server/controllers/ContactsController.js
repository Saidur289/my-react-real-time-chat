import mongoose from "mongoose";
import Message from "../models/MessagesModel.js";
import User from "../models/UserModel.js";

export const searchContacts = async (request, response, next) => {
    try {
       const {searchTerm} = request.body 
       if(searchTerm === undefined || searchTerm === null){
        return response.status(400).send('Search Term Is Required')
       }
       const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
       const regex = new RegExp(sanitizedSearchTerm, "i");
    //    console.log(regex, "contact controller");
       const contacts = await User.find({
        $and: [
            {_id: {$ne: request.userId}},
            {$or: [{firstName: regex}, {lastName: regex}, {email: regex}],}
        ],
       })
    //    console.log({contacts});
       return response.status(200).json({contacts})
    } catch (error) {
        console.log('Error From Search contact function   function Contacts Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}
export const getContactsForDMList = async (request, response, next) => {
    try {
     let {userId} = request
     userId = new mongoose.Types.ObjectId(userId)
     const contacts = await Message.aggregate([
        {
            $match: {
                $or: [{sender: userId}, {recipient: userId}],
            },
        },
        {
            $sort: {timestamp: -1},
        },
        {
            $group: {
                _id: {
                    $cond: {
                        if: {$eq: ["sender", userId]},
                        then: "$recipient",
                        else: "$sender",
                    },
                },
                lastMessageTime: {$first: "$timestamp"}
            }
        },
        
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "contactInfo",
            }
        },
        {
            $unwind: "$contactInfo",
        },
        {
            $project: {
                _id: 1,
                lastMessageTime: 1,
                email: "$contactInfo.email",
                firstName: "$contactInfo.firstName",
                lastName: "$contactInfo.lastName",
                image: "$contactInfo.image", 
                color: "$contactInfo.color",
            },
        },

        {
            $sort: {lastMessageTime: -1},
        },
     ])
        // console.log({contacts}, 'contacts controller function');
       return response.status(200).json({contacts})
    } catch (error) {
        console.log('Error From Search contact function   function Contacts Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}
export const getAllContact = async (request, response, next) => {
    try {
     const users = await User.find({_id: {$ne: request.userId}}, "firstName lastName _id email");
     const contacts = users.map((user) => ({
        label: user.firstName ? `${user.firstName} ${user. lastName}`: `${user.email}`,
        value: user._id,
     }))
     
    //  console.log({contacts}, "show in get all contacts ");
       return response.status(200).json({contacts})
    } catch (error) {
        console.log('Error From get all contacts   function Contacts Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}