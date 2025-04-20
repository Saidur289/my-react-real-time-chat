import React, { useState } from "react";
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { colors, getColor } from "../../lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { UPDATE_PROFILE_ROUTE } from "../../utils/constaints";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  // console.log(userInfo);
  // declare state for functionality for image upload and profile update
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
// function for validate profile 
const validateProfile = () => {
    if(!firstName){
        toast.error('First Name is Required')
        return false
    }
    if(!lastName){
        toast.error('Last Name is Required')
        return false
    }
    return true
}
  const saveChanges = async () => {
   try {
    if(validateProfile()){
      const response = await apiClient.post(UPDATE_PROFILE_ROUTE, {firstName, lastName, color: selectedColor}, {withCredentials: true})   
      if(response.status === 200 && response.data){
        setUserInfo({...response.data})
        toast.success('Profile Updated Successfully')
        navigate("/chat")
      }
    }
   } catch (error) {
    console.log(error);
    toast.error(error.response)
   }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80wh] md:w-max">
        <div>
          <IoArrowBack className="text-4xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-[128px] w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile image"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase rounded-full h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center  ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute rounded-full inset-0 flex items-center justify-center bg-black/55 ring-fuchsia-50">
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            {/* <input type="text" /> */}
          </div>
          <div className="flex min-h-32 md:min-h-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type={"email"}
                disabled
                value={userInfo?.email}
                className={"rounded-lg p-6 bg-[#2c2e3b] border-none"}
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type={"text"}
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className={"rounded-lg p-6 bg-[#2c2e3b] border-none"}
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type={"text"}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className={"rounded-lg p-6 bg-[#2c2e3b] border-none"}
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? " outline-white/50 outline-1"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
            <Button onClick={saveChanges} className={'h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'}>Save Changes</Button>

        </div>
      </div>
    </div>
  );
};

export default Profile;
