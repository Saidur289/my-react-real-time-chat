import React from 'react';
import { useAppStore } from '../store';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const {userInfo} = useAppStore()
    const isAuthenticated = !!userInfo
    return isAuthenticated? <Navigate to='/auth'></Navigate>: children
};

export default PrivateRoute;