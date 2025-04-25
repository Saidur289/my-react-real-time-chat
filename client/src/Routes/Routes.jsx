import * as React from "react";

import {
  createBrowserRouter,
  
} from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Auth from "../pages/Auth/Auth";
import Profile from "../pages/Profile/Profile";
import Chat from "../pages/Chat/Chat";
import PrivateRoute from "./PrivateRoute";
import AuthRoute from "./AuthRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: '/',
        element: <AuthRoute><Auth></Auth></AuthRoute>,

      },
      {
        path: '/auth',
        element: <AuthRoute><Auth></Auth></AuthRoute>,

      },
      {
        path: '/profile',
        element: <PrivateRoute><Profile></Profile></PrivateRoute>,
      },
      {
        path: '/chat',
        element: <PrivateRoute><Chat></Chat></PrivateRoute>
      }
    ]
  },
]);
export default router