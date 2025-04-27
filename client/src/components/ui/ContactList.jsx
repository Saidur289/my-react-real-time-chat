import { getColor } from "../../lib/utils";
import { useAppStore } from "../../store";
import { HOST } from "../../utils/constaints";
import { Avatar, AvatarImage } from "./avatar";


const ContactList = ({contacts, isChannel=false}) => {
    
    const {setSelectedChatData, setSelectedChatMessages,  setSelectedChatType,   selectedChatData, selectedChatType} = useAppStore()
    const handleClick = (contact) => {
        if(isChannel) setSelectedChatType("channel")
            else setSelectedChatType("contact")
        setSelectedChatData(contact)
        if(selectedChatData && selectedChatData._id !== contact._id){
            setSelectedChatMessages([])
        }
        // console.log(contact);

    }

    return (
    <div className="mt-5">
            {
                contacts?.map((contact,index) => (
                    <div key={index} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id? "bg-[#8417ff] hover:bg-[#B417ff]": "hover:bg-[#f1f1f111]"}`} onClick={() => handleClick(contact)}>
                        <div className="flex gap-5 items-center justify-start text-neutral-300">
                            {
                              // console.log(contact)
                                !isChannel &&   <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                {contact?.image ? (
                                  <AvatarImage
                                    src={contact?.image}
                                    alt="profile image"
                                    className="object-cover w-full h-full bg-black rounded-full"
                                  />
                                ) : (
                                  <div key={index}
                                    className={`${selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border-2 border-white/70": getColor(contact.color)} uppercase rounded-full h-10 w-10 text-lg border-[1px] flex items-center justify-center  ${getColor(
                                      contact?.color
                                    )}`}
                                  >
                                    {contact?.firstName
                                      ? contact?.firstName.split("").shift()
                                      : contact.email}
                                  </div>
                                )}
                              </Avatar>
                            }
                            {
                                isChannel && (
                                    <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                                      #
                                    </div>
                                )
                            }
                             {
                                        isChannel ? <span>{contact.name}</span> : <span>{contact.firstName ? `${contact.firstName} ${contact.lastName}`: contact.email}</span>
                                       } 

                        </div>
                    </div>
                ))
            }
           
        </div>
    );
};

export default ContactList;