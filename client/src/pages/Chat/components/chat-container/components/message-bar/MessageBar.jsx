import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerFill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "../../../../../../context/SocketContext";
import { useAppStore } from "../../../../../../store";
import { apiClient } from "../../../../../../lib/api-client";
import { UPLOAD_FILE_ROUTE } from "../../../../../../utils/constaints";
import { data } from "react-router-dom";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const socket = useSocket();
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    setFileUploadProgress,
    setIsUploading,
  } = useAppStore();
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target))
        setEmojiPickerOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);
  // console.log({selectedChatData}, "message bar");
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  // console.log("show from message bar", selectedChatType);
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }else if(selectedChatType === 'channel'){
        socket.emit("send-channel-message", {
            sender: userInfo.id,
            content: message,
            messageType: "text",
            fileUrl: undefined,
            channelId: selectedChatData._id,
        })
    }
    setMessage("");
  };
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // const handleAttachmentChange = async (event) => {
  //   try {
  //     const file = event.target.files[0];
  //     // console.log({file});
  //     if (file) {
  //       const formData = new FormData();
  //       formData.append("file", file);
  //       setIsUploading(true);
  //       const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
  //         withCredentials: true,
  //         onUploadProgress: (data) => {
  //           setFileUploadProgress(Math.round(100 * data.loaded) / data.total);
  //         },
  //       });
  //       if (response.status === 200 && response.data) {
  //         setIsUploading(false);
  //         if (selectedChatType === "contact") {
  //           socket.emit("sendMessage", {
  //             sender: userInfo.id,
  //             content: undefined,
  //             recipient: selectedChatData._id,
  //             messageType: "file",
  //             fileUrl: response.data.filePath,
  //           });
  //         }else if(selectedChatType === 'channel'){
  //           socket.emit("send-channel-message", {
  //             sender: userInfo.id,
  //             content: undefined,
  //             messageType: "file",
  //             fileUrl: response.data.filePath,
  //             channelId: selectedChatData._id,

  //           })
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     setIsUploading(false);
  //     console.log({ error }, "error from handle attachment change function");
  //   }
  // };
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];  // Get the file from input
      if (file) {
        const formData = new FormData();
        formData.append("file", file); // Append file to FormData
  
        setIsUploading(true);  // Start showing the progress bar or loader
  
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            // Handle upload progress
            setFileUploadProgress(Math.round(100 * data.loaded) / data.total);
          },
        });
  
        if (response.status === 200 && response.data) {
          setIsUploading(false);  // Stop showing the progress bar
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath, // Send Cloudinary URL
            });
          } else if (selectedChatType === 'channel') {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,  // Send Cloudinary URL
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);  // Stop showing the progress bar if there was an error
      console.log("Error from handleAttachmentChange function", error);
    }
  };
  
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md    items-center gap-5 pr-5">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent p-5 rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
        />
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerFill className="text-2xl" />
          </button>
          <div ref={emojiRef} className="absolute bottom-16 right-0">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl text-white" />
      </button>
    </div>
  );
};

export default MessageBar;
