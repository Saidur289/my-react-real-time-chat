import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";
const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
        origin:process.env.ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true,
        }
    })
    const userSocketMap = new Map()
    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for(const [userId, socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId)
                break;
            }
        }
    }
    const sendMessage = async(message) => {
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient)
        // console.log("message from all id ", senderSocketId, recipientSocketId);
        const createMessage = await Message.create(message)
        // console.log("send message from :", createMessage._id);
        const messageData = await Message.findById(createMessage._id).populate("sender", "id email firstName lastName image color").populate("recipient", "id email firstName lastName image color");
        if(recipientSocketId){
            io.to(recipientSocketId).emit('receiveMessage', messageData)
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("receiveMessage", messageData)
        }
    }
    // channel message function 
    // const sendChannelMessage = async(message) => {
    //  const {channelId, sender, content, messageType, fileUrl} = message
    //  const createMessage = await Message.create({
    //     sender,
    //     recipient: null,
    //     content,
    //     messageType,
    //     timestamp: new Date(),
    //     fileUrl
    //  })
    //  console.log({createMessage}, "show before message send channel function");
    //  const messageData = await Message.findById(createMessage.__id).populate("sender", "id email firstName lastName image color").exec()
    //  console.log({messageData}, "show before message send channel function");
    // await Channel.findByIdAndUpdate(channelId, {
    //     $push: {messages: createMessage._id}
    // })
    // const channel = await Channel.findById(channelId).populate("members")
    // console.log({channel}, "show before message send channel function");
    // const finalData = {...messageData._doc, channelId: channel._id}
    // console.log({finalData}, "show before message send channel function");
    // if(channel && channel.members){
    //     channel.members.forEach((member) => {
    //         const memberSocketId = userSocketMap.get(member._id.toString());
    //         if(memberSocketId){
    //             io.to("receive-channel-message", finalData);
    //             console.log({memberSocketId}, "show before message send channel function");
    //         }
          
    //     })
    //     const adminSocketId = userSocketMap.get(channel.admin._id.toString())
    //     if(adminSocketId){
    //         io.to(adminSocketId).emit("receive-channel-message", finalData);
    //         console.log({adminSocketId}, "show before message send channel function");
    //     }
    // }
    // }
    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;
      
        try {
          // ১. নতুন মেসেজ তৈরি
          const createMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timestamp: new Date(),
            fileUrl,
          });
      
          // ২. মেসেজ ডেটা পপুলেট করা
          const messageData = await Message.findById(createMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .exec();
      
          if (!messageData || !messageData._doc) {
            console.error("❌ Message not found or population failed");
            return;
          }
      
          // ৩. চ্যানেলে মেসেজ ID যোগ করা
          await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createMessage._id },
          });
      
          // ৪. চ্যানেলের সব মেম্বার লোড করা
          const channel = await Channel.findById(channelId).populate("members");
      
          if (!channel) {
            console.error("❌ Channel not found");
            return;
          }
      
          const finalData = { ...messageData._doc, channelId: channel._id };
      
          // ৫. সব মেম্বারকে মেসেজ পাঠানো
          if (channel.members && Array.isArray(channel.members)) {
            channel.members.forEach((member) => {
              const memberSocketId = userSocketMap.get(member._id.toString());
              if (memberSocketId) {
                io.to(memberSocketId).emit("receive-channel-message", finalData);
                // console.log(`✅ Message sent to member ${member._id}`);
              }
            });
          }
      
          // ৬. অ্যাডমিনকে মেসেজ পাঠানো (যদি আলাদা)
          const adminSocketId = userSocketMap.get(channel.admin?._id?.toString());
          if (adminSocketId) {
            io.to(adminSocketId).emit("receive-channel-message", finalData);
            // console.log(`✅ Message sent to admin ${channel.admin._id}`);
          }
      
        } catch (error) {
          console.error("❌ Error sending channel message:", error.message);
        }
      };
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId
        // console.log("when connection made:", userId);
        if(userId){
            userSocketMap.set(userId, socket.id);
            // console.log(`User connected: ${userId} with socket Id: ${socket.id}`);
        }else{
            console.log("User Id not provided during connection");
        }
        socket.on("sendMessage", sendMessage)
        socket.on("send-channel-message", sendChannelMessage)
        socket.on('disconnect', () => disconnect(socket))
    })
    

}
export default setupSocket