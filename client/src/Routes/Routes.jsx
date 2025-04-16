import * as React from "react";

import {
  createBrowserRouter,
  
} from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Auth from "../pages/Auth/Auth";
import Profile from "../pages/Profile/Profile";
import Chat from "../pages/Chat/Chat";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: '*',
        element: <Auth></Auth>,

      },
      {
        path: '/auth',
        element: <Auth></Auth>,

      },
      {
        path: '/profile',
        element: <Profile></Profile>,
      },
      {
        path: '/chat',
        element: <Chat></Chat>
      }
    ]
  },
]);
export default router