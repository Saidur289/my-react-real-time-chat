import { useEffect } from "react";
import NewDm from "./components/profile-info/new-dm/NewDm";
import ProfileInfo from "./components/profile-info/ProfileInfo";
import { apiClient } from "../../../../lib/api-client";
import {GET_CONTACTS_ROUTES, GET_USER_CHANNEL_ROUTE } from "../../../../utils/constaints";
import { useAppStore } from "../../../../store";
import ContactList from "../../../../components/ui/ContactList";
import CreateChannel from "./components/create-channel/CreateChannel";


const ContactsContainer = () => {
  const { setChannels,setDirectMessagesContacts, directMessagesContacts, channels} = useAppStore()
  // console.log({userInfo});
  useEffect(() => {
    const getContacts = async() => {
      const response = await apiClient.get(GET_CONTACTS_ROUTES, {withCredentials: true})
      if(response.data.contacts){
        // console.log(response.data.contacts);
        setDirectMessagesContacts(response.data.contacts)

      }
    } 
    const getChannels = async() => {
      const response = await apiClient.get(GET_USER_CHANNEL_ROUTE, {withCredentials: true})
      if(response.data.channels){
        // console.log(response.data.contacts);
        setChannels(response.data.channels)

      }
    } 
    // const getChannels = async () => {
    //   try {
    //     // Fetch channels from the API
    //     const response = await apiClient.get(GET_USER_CHANNEL_ROUTE, { withCredentials: true });
    
    //     if (response.data.channels) {
    //       // Set channels into the store
    //       setChannels(response.data.channels);
          
    //       // Optionally, if you want to add each channel to the list using your store action
    //       response.data.channels.forEach(channel => {
    //         addChannelInChannelList(channel); // Use the store action to add each channel
    //       });
    //     }
    //   } catch (error) {
    //     console.error("Error fetching channels:", error);
    //   }
    // };
    getContacts()

    getChannels()
  }, [setChannels, setDirectMessagesContacts])
  // console.log({directMessagesContacts});
    return (
        <div className="relative md:w-[40vw] lg:w-[35vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
            <div className="pt-3">
            <Logo/>
            </div>
            <div className="my-5">
            <div className="flex items-center justify-between pr-10">
                <Title text='Direct Messages'/>
                <NewDm/>
            </div>
            <div className="max-h-[30vh] overflow-y-auto scroll-smooth">
             <ContactList contacts={directMessagesContacts}/>
            </div>
            </div>
            <div className="my-5">
            <div className="flex items-center justify-between pr-10">
                <Title text='Channels'/>
                <CreateChannel/>
            </div>
            <div className="max-h-[30vh] overflow-y-auto scroll-smooth">
             <ContactList contacts={channels} isChannel={true}/>
            </div>

            </div>
            <ProfileInfo/>
        </div>
    );
};

export default ContactsContainer;
const Title = ({text}) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light opacity-90 text-sm">{text}</h6>
    )
}
const Logo = () => {
    return (
      <div className="flex p-5  justify-start items-center gap-2">
        <svg
          id="logo-38"
          width="78"
          height="32"
          viewBox="0 0 78 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <path
            d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
            className="ccustom"
            fill="#8338ec"
          ></path>{" "}
          <path
            d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
            className="ccompli1"
            fill="#975aed"
          ></path>{" "}
          <path
            d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
            className="ccompli2"
            fill="#a16ee8"
          ></path>{" "}
        </svg>
        <span className="text-3xl font-semibold ">TeamBridge</span>
      </div>
    );
  };
  
  