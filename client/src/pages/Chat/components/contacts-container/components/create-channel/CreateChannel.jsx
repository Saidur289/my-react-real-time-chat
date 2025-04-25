import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


import Lottie from "react-lottie";
import {toast} from 'sonner'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../../../components/ui/tooltip";
import { apiClient } from "../../../../../../lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE, SEARCH_CONTACTS_ROUTE } from "../../../../../../utils/constaints";
import { useAppStore } from "../../../../../../store";
import { Input } from "../../../../../../components/ui/input";
import { Button } from "../../../../../../components/ui/button";
import MultipleSelector from "../../../../../../components/ui/multipleselect";

const CreateChannel = () => {

  const {setSelectedChatData,   setSelectedChatType,  addChannel} = useAppStore()
  const [searchedContact, setSearchedContact] = useState([])
  const [allContacts, setAllContacts] = useState([])
  const [selectedContacts, setSelectedContacts] = useState([])
  const [newChannelModal, setNewChannelModal] = useState(false)
  const [channelName, setChannelName] = useState('')
  useEffect(() => {
    const getData = async() => {
        const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {withCredentials: true})
        setAllContacts(response.data.contacts)

    }
    getData()
  }, [])
  const createChannel = async() => {
try {
   if(channelName.length>0 && selectedContacts.length>0){
    const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {name: channelName, members: selectedContacts.map((contact) => contact.value)} ,{withCredentials: true})
    if(response.status === 200 ){
        setChannelName("");
        setSelectedContacts([])
        setNewChannelModal(false)
        addChannel(response.data.channel)
    }
   }
   

} catch (error) {
    console.log("error from create contact function", {error});
    toast.error(error.message)
}   
  }
  // functionality for search filter contact -1 
  const searchContacts = async(searchTerm) => {
   try {
    if(searchTerm.length>0){
      const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, {searchTerm}, {withCredentials: true})
      if(response.status=== 200 && response.data.contacts){
        setSearchedContact(response.data.contacts)
      }
      else{
        setSearchedContact([])
      }
    }
   } catch (error) {
    console.log(error);
    toast.error(error)
   }
  }
  // functionality for selected filter contact - 2
  const selectNewContact = (contact) => {
    setOpenNewContactModal(false)
    setSelectedChatType('contact')
    setSelectedChatData(contact)
    setSearchedContact([])
  }
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FiPlus
              onClick={() => setNewChannelModal(true)}
              className="text-neutral-400 font-light opacity-80 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        {/* <DialogTrigger></DialogTrigger> */}
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please fill up the details for new channel.</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input value={channelName} onChange={(e) =>setChannelName(e.target.value)} className={"rounded-lg p-6 bg-[#2c2e3b] border-none"} placeholder='Channel Name'/>
          </div>
          <div>
            <MultipleSelector className="rounded-lg p-2 bg-[#2c2e3b] border-none"
            defaultOptions={allContacts}
            placeholder="Search Contacts"
            value={selectedContacts}
            onChange={setSelectedContacts}
            emptyIndicator={
                <p className="rounded-lg text-lg leading-10 text-gray-600">No Result Found</p>
            }
            />
          </div>
          <div>
            <Button className={'w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'} onClick={createChannel}>Create Channel</Button>
          </div>
        
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
