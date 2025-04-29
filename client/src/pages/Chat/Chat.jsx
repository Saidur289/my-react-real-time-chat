import React, { useEffect } from 'react';
import { useAppStore } from '../../store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ContactsContainer from './components/contacts-container/ContactsContainer';
import EmptyChatContainer from './components/empty-chat-container/EmptyChatContainer';
import ChatContainer from './components/chat-container/ChatContainer';

const Chat = () => {
    const {userInfo,  selectedChatType , fileDownloadProgress, fileUploadProgress,   isDownloading,  isUploading} = useAppStore()
    
    const navigate = useNavigate()
    useEffect(() => {
        if(!userInfo?.profileSetup){
            toast.error('Please set up your profile to continue')
            navigate('/profile')
        }
    }, [userInfo, navigate])
    return (
        <div className='flex h-[100vh] text-white overflow-hidden'>
            {
                isUploading && (<div className='w-[100vw] h-[100vh] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg '>
                    <h1 className='text-5xl animate-pulse'>Uploading File</h1>
                    {fileUploadProgress}
                </div>)
            }
            {
                isDownloading && (<div className='w-[100vw] h-[100vh] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg '>
                    <h1 className='text-5xl animate-pulse'>Downloading File</h1>
                    {fileDownloadProgress}
                </div>)
            }
            <ContactsContainer/>
            {selectedChatType ===  undefined ?     <EmptyChatContainer/> :   <ChatContainer/>}
         
          
        </div>
    );
};

export default Chat;