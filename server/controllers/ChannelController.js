import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";
// import { io } from "../socket.js";

export const createChannel = async (request, response, next) => {
    try {
      const {name, members} = request.body 
      const userId = request.userId 
      const admin = await User.findById(userId)
      if(!admin){
        return response.status(400).send("Admin user not found")
      }
      const validMembers = await User.find({_id: {$in: members}});
      if(validMembers.length !== members.length){
        return response.status(400).send("Some members are not valid users.")
      }
      const newChannel = new Channel({
        name,
        members,
        admin: userId
      })
      // console.log("new channel members", {newChannel});
      await newChannel.save()
      // Emit socket event for new channel
    // io.emit('new-channel', newChannel); // Make sure `io` is correctly initialized
      return response.status(200).json({channel: newChannel})
    } catch (error) {
        console.log('Error From createChannel  function Channel  Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}
export const getUserChannels = async (request, response, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(request.userId)
        const channels =await Channel.find({
          $or: [{admin: userId}, {members: userId}],
        }).sort({updatedAt: -1})
        // console.log(`${channels} data is for all channel get user channles functions`);
      return response.status(200).json({channels})
    } catch (error) {
        console.log('Error From getUserChannels  function Channel  Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}
export const getChannelMessages = async (request, response, next) => {
    try {
     const {channelId} = request.params;
     console.log({channelId}, "channel id ");
     const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color"
      },
     });
    //  console.log("channels name info", {channel});
     if(!channel){
      return response.status(404).send("Channel not found")
     }
     const messages = channel.messages
    //  console.log("channels name info data from messages", {messages});

      return response.status(200).json({messages})
    } catch (error) {
        console.log('Error From Get Channels Messages  function Channel  Controller',{error});
        return response.status(500).send("Internal Server Error");
        
    }
}