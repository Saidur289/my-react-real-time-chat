import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../../../store";
import moment from "moment";
import { apiClient } from "../../../../../../lib/api-client";
import {toast} from "sonner"
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  HOST,
} from "../../../../../../utils/constaints";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../../components/ui/avatar";
import { getColor } from "../../../../../../lib/utils";

const MessageContainer = () => {
  const {
    selectedChatMessages,
    selectedChatData,
    selectedChatType,
    userInfo,
    setSelectedChatMessages,
    setFileDownloadingProgress,
    setIsDownloading,
  } = useAppStore();
  // console.log(userInfo);
  const scrollRef = useRef();
  // state for show image big
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
//   console.log("selected chat messages",{});
  // fetch for get all message data step - 1
  useEffect(() => {
    // get messages for contact part step - 1
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({error}, "error from get messages function");
      }
    };
    // get messages for channel part step - 2
    // const getChannelMessages = async() => {
    //     try {
    //         const response = await apiClient.get(
    //           `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
              
    //           { withCredentials: true }
    //         );
    //         if (response.data.messages) {
    //           setSelectedChatMessages(response.data.messages);
    //         }
    //       } catch (error) {
    //         console.log({error}, "error from get messages function");
    //         toast.error(error.message)
    //       }
    // }
    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES.replace(':channelId', selectedChatData._id)}`,  // Replacing the :channelId in URL
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error }, "error from get messages function");
        toast.error(error.response.data);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === 'channel') getChannelMessages()
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);
  // function  for after send message auto scroll  step - 2
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  // function for check file is image step - 3
  const checkIfImage = (url) => {
    const imageRegex = /^.*\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return imageRegex.test(url);
  };
  // function for call back  data step - 4
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };
  // function for download file
  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadingProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadingProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    // console.log('clicked me', {urlBlob});
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadingProgress(0);
  };
  // function for send message
  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-[#ffffff]/50 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-[#ffffff]/50 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                width={300}
                height={300}
                alt="send image"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-5">
              <span className="text-white text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20  p-3 rounded-full text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300">
                <IoMdArrowRoundDown
                  onClick={() => downloadFile(message.fileUrl)}
                />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );
  const renderChannelMessages = (message) => {
    // console.log({message}, "from channel message");
    return (
      <div
        className={`mt-5 ${
          message.sender._id === userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {/* show text  */}
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id !== userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-[#ffffff]/50 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {/* show file or image  */}
        {message.messageType === "file" && (
        <div
          className={`${
            message.sender === userInfo.id
              ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-[#ffffff]/50 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                width={300}
                height={300}
                alt="send image"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-5">
              <span className="text-white text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20  p-3 rounded-full text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300">
                <IoMdArrowRoundDown
                  onClick={() => downloadFile(message.fileUrl)}
                />
              </span>
            </div>
          )}
        </div>
      )}
        {
            message.sender._id ? <div className="flex items-center justify-start gap-2">
                 <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                {selectedChatData?.image && (
                  <AvatarImage
                    src={`${HOST}/${message?.sender?.image}`}
                    alt="profile image"
                    className="object-cover w-full h-full bg-black"
                  />
                ) }
                  <AvatarFallback
                    className={`uppercase rounded-full h-8 w-8 text-lg  flex items-center justify-center  ${getColor(
                      message?.sender?.color
                    )}`}
                  >
                    {message?.sender?.firstName? message.sender?.firstName.split("").shift(): message.sender.email.split("").shift()}
                  </AvatarFallback>
                
              </Avatar>
              <span className="text-xs text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
              <span className="text-xs text-white/60">{moment(message.timestamp).format("LT")}</span>
            </div> : <div className="text-xs text-white/60">{moment(message.timestamp).format("LT")}</div>
        }
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="h-[100vh] w-full bg-cover"
              alt="big image"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              onClick={() => downloadFile(imageURL)}
              className="bg-black/20  p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
              className="bg-black/20  p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
