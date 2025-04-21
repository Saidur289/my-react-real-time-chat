import { useEffect, useRef, useState } from "react";
import {GrAttachment} from 'react-icons/gr'
import { RiEmojiStickerFill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

const MessageBar = () => {
    const [message, setMessage] = useState('')
    const emojiRef = useRef()
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
    useEffect(() => {
        function handleClickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target))
            
                setEmojiPickerOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [emojiRef])
    const handleAddEmoji = (emoji) => {
      setMessage((msg) => msg + emoji.emoji)
    }
    const handleSendMessage = async() => {

    }
    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
          <div className="flex-1 flex bg-[#2a2b33] rounded-md    items-center gap-5 pr-5">
            <input type="text" value={message} onChange={(e) =>setMessage(e.target.value)} className="flex-1 bg-transparent p-5 rounded-md focus:border-none focus:outline-none" placeholder="Enter Message" />
             <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                                <GrAttachment className='text-2xl'/>
                               
                            </button>
                            <div className="relative">
                            <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={() => setEmojiPickerOpen(true)}>
                                <RiEmojiStickerFill className='text-2xl'/>
                               
                            </button>
                            <div ref={emojiRef} className="absolute bottom-16 right-0">
                            <EmojiPicker  theme="dark" open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false}/>
                            </div>
                            </div>
            </div> 
            <button className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <IoSend className='text-2xl text-white'/>
            </button>
        </div>
    );
};

export default MessageBar;