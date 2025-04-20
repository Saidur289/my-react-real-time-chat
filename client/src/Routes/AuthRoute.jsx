import React from 'react';
import { useAppStore } from '../store';
import { Navigate } from 'react-router-dom';
const AuthRoute  = ({children}) => {
    const {userInfo} = useAppStore()
    const isAuthenticated = !!userInfo
  
    if(isAuthenticated){
        return <Navigate to='/chat'></Navigate>
    }else return children
        

};

export default AuthRoute;;