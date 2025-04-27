import * as React from "react";

import {
  createBrowserRouter,
  Navigate,
  
} from "react-router-dom";
import MainLayout, { AuthRoute, PrivateRoute } from "../Layout/MainLayout";
import Auth from "../pages/Auth/Auth";
import Profile from "../pages/Profile/Profile";
import Chat from "../pages/Chat/Chat";



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
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
      },
      {
        path: "/",
        element: <AuthRoute><Auth></Auth></AuthRoute>
      }
    ]
  },
]);
export default router