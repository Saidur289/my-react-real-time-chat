import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "../../../../../../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../../../components/ui/tooltip";
import { getColor } from "../../../../../../lib/utils";
import { useAppStore } from "../../../../../../store";
import { HOST, LOGOUT_ROUTE } from "../../../../../../utils/constaints";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { toast } from "sonner";
import { apiClient } from "../../../../../../lib/api-client";
const ProfileInfo = () => {
    const navigate =useNavigate()
  const { userInfo, setUserInfo } = useAppStore();
  const logout = async() => {
  try {
    const response = await apiClient.post(LOGOUT_ROUTE, {}, {withCredentials: true})
    if(response.status === 200){
        navigate('/auth')
        setUserInfo(null)
    }
  } catch (error) {
    console.log({error});
    toast.error(error.message)
  }
  }
  return (
    <div className="absolute bg-[#2a2b33] bottom-0 h-16 flex items-center justify-center px-10 w-full gap-5">
      <div className="flex gap-3 items-center justify-center">
        {/* first child div */}
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo?.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo?.image}`}
                alt="profile image"
                className="object-cover w-full h-full bg-black rounded-full"
              />
            ) : (
              <div
                className={`uppercase rounded-full h-12 w-12 text-lg border-[1px] flex items-center justify-center  ${getColor(
                  userInfo?.color
                )}`}
              >
                {userInfo?.firstName
                  ? userInfo?.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        {/* second child */}
        <div>
          {userInfo?.firstName && userInfo?.lastName
            ? `${userInfo?.firstName} ${userInfo?.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger><FiEdit2 onClick={()=> navigate('/profile')} className="text-purple-500 text-xl font-medium"/></TooltipTrigger>
            <TooltipContent>
              <p className="bg-[#1c1b1e] border-none text-white">Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger><IoPowerSharp onClick={logout} className="text-purple-500 text-xl font-medium"/></TooltipTrigger>
            <TooltipContent>
              <p className="bg-[#1c1b1e] border-none text-white">Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
