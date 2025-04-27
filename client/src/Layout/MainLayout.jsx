import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../store';
import { apiClient } from '../lib/api-client';
import { GET_USER_INFO } from '../utils/constaints';
import {toast} from 'sonner'

export const PrivateRoute = ({children}) => {
    const {userInfo} = useAppStore()
    const isAuthenticated = !!userInfo 
    return isAuthenticated? children : <Navigate to={'/auth'}/>
}
export const AuthRoute = ({children}) => {
    const {userInfo} = useAppStore()
    const isAuthenticated = !!userInfo 
    return isAuthenticated? <Navigate to={"/chat"}/> : children
}
const MainLayout = () => {
    const {userInfo, setUserInfo} = useAppStore()
    // console.log({userInfo});
    const [loading, setLoading] = useState(true)
    useEffect(() => {
  const getUserData = async() => {
     try {
        // setLoading(true)
        const response = await apiClient.get(GET_USER_INFO, {withCredentials: true})
        
        if(response.status === 200 && response.data.id){
            // setLoading(false)
            setUserInfo(response.data)
        }else{
            setUserInfo(undefined)
        }
        // console.log({response});
     } catch (error) {
        setUserInfo(undefined)
        console.log('Error from mainlayout component', error);
        // toast.error(error.message)
     }
     finally{
        setLoading(false)
     }
   }
    if(!userInfo){
        getUserData()
       setLoading(false)
        
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