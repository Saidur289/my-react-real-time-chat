import { createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "../store";
import {io} from 'socket.io-client'
import { HOST } from "../utils/constaints";
const SocketContext = createContext(null)
export const useSocket = () => {
    return useContext(SocketContext)
}
export const SocketProvider = ({children}) => {
   
    const socket = useRef()
    const {userInfo} = useAppStore()
    useEffect(() => {
      if(userInfo){
        socket.current = io(HOST, {
            withCredentials: true,
            query: {userId: userInfo.id},
        });
        socket.current.on("connect", () => {
            console.log("Connection to socket server");
        });
        const handleReceiveMessage = (message) => {
            const {selectedChatData, selectedChatType, addMessage, addContactsInDMContacts} = useAppStore.getState()
            if(selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)){
                console.log("message receive", message);
                addMessage(message);
            }
            addContactsInDMContacts(message)
        }
        // function for receive channel message 
        const handleReceiveChannelMessage = (message) => {
            const {selectedChatData, addChannelInChannelList, selectedChatType, addMessage} = useAppStore.getState()
            if(selectedChatType !== undefined && selectedChatData._id === message.channelId){
                addMessage(message)
            }
            // after send message channel index will changed 
            addChannelInChannelList(message)


        }

        socket.current.on("receiveMessage", handleReceiveMessage)
        socket.current.on("receive-channel-message", handleReceiveChannelMessage)
        return () => {
            socket.current.disconnect();
        }
      }
    }, [userInfo])
    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}