import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../../components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../../../../../../../components/ui/input";
import { animationDefaultOptions, getColor } from "../../../../../../../lib/utils";
import Lottie from "react-lottie";
import {toast} from 'sonner'
import { apiClient } from "../../../../../../../lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "../../../../../../../utils/constaints";
import { ScrollArea } from "../../../../../../../components/ui/scroll-area";
import { Avatar, AvatarImage } from "../../../../../../../components/ui/avatar";
import { useAppStore } from "../../../../../../../store";

const NewDm = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const {setSelectedChatData,   setSelectedChatType} = useAppStore()
  const [searchedContact, setSearchedContact] = useState([])
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
              onClick={() => setOpenNewContactModal(true)}
              className="text-neutral-400 font-light opacity-80 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        {/* <DialogTrigger></DialogTrigger> */}
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input onChange={(e) =>searchContacts(e.target.value)} className={"rounded-lg p-6 bg-[#2c2e3b] border-none"} placeholder='Search Contact'/>
          </div>
          {searchedContact.length > 0 && (
            <ScrollArea className={'h-[250]'}>
            <div className="flex flex-col gap-5">
              {searchedContact.map((contact, index) => <div onClick={() => selectNewContact(contact)} className="flex gap-3 items-center cursor-pointer"key={index}>
                {/* first child  */}
              <div className="w-12 h-12 relative">
              
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {contact?.image ? (
              <AvatarImage
                src={`${HOST}/${contact?.image}`}
                alt="profile image"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase rounded-full h-12 w-12 text-lg border-[1px] flex items-center justify-center  ${getColor(
                  contact?.color
                )}`}
              >
                {contact?.firstName
                  ? contact?.firstName.split("").shift()
                  : contact.email.split("").shift()}
              </div>
            )}
          </Avatar>
              </div>
              {/* second child */}
                <div className="flex flex-col">
                 <span>
                 {contact?.firstName && contact?.lastName
            ? `${contact?.firstName} ${contact?.lastName}`
            : contact?.email}
                 </span>
                 <span className="text-xs">
                  {contact?.email}

                 </span>
                </div>
              </div>)}

            </div>
          </ScrollArea>
          )}
          {
            searchedContact.length <=0 && (
                <div className="flex-1  md:flex flex-col justify-center items-center mt-5 duration-1000 transition-all">
                <Lottie isClickToPauseDisabled={true} height={100} width={100} options={animationDefaultOptions}/>
                <div className='opacity-80 text-white flex flex-col items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
               <h3 className='poppins-medium'>
                 Hi<span className='text-purple-500'>!</span> Search New <span className='text-purple-500'>Contact</span> 
                 
                 </h3>   
               
                </div>
             </div>
            )
          }
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
