import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '../store';
import { apiClient } from '../lib/api-client';
import { GET_USER_INFO } from '../utils/constaints';
import {toast} from 'sonner'

const MainLayout = () => {
    const {userInfo, setUserInfo} = useAppStore()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
  const getUserData = async() => {
     try {
        const response = await apiClient.get(GET_USER_INFO, {withCredentials: true})
        console.log({response});
     } catch (error) {
        console.log('Error from mainlayout component', error);
        toast.error(error.message)
     }
   }
    if(!userInfo){
        getUserData()
        
    }else{
        setLoading(false)
    }
 
    }, [userInfo, setUserInfo])
    if(loading) return <p>Loading....</p>
    return (
        <div>
           <Outlet></Outlet>
        </div>
    );
};

export default MainLayout;