import MovieManagement from "@/pages/admin/movie-management";
import UserManagement from "@/pages/admin/user-management";
import Login from "@/pages/auth/login";
import AddMovie from "@/pages/admin/movie-management/AddMovie";
import EditMovie from "@/pages/admin/movie-management/EditMovie";
import ShowtimeManagement from "@/pages/admin/movie-management/ShowtimeManagement";

import React from "react";
import { useRoutes } from "react-router-dom";
import { PATH } from "./path";
import AuthLayout from "@/components/layouts/auth";
import DashboardLayout from "@/components/layouts/dashboard";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import RootRedirect from "./RootRedirect";
import CreateShowtime from "@/pages/admin/movie-management/CreateShowtime";

const useRouterElements = () => {
  const elements = useRoutes([
    // 🏠 ROOT - CHUYỂN HƯỚNG THÔNG MINH
    {
      path: "/",
      element: <RootRedirect />,
    },

    // 🔐 ROUTE ĐĂNG NHẬP
    {
      path: PATH.LOGIN,
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      ),
    },

    // 🔒 TẤT CẢ ADMIN ROUTES ĐƯỢC BẢO VỆ
    {
      path: "/admin",
      element: <ProtectedAdminRoute />,
      children: [
        {
          path: "user-management",
          element: (
            <DashboardLayout>
              <UserManagement />
            </DashboardLayout>
          ),
        },
        {
          path: "movie-management",
          element: (
            <DashboardLayout>
              <MovieManagement />
            </DashboardLayout>
          ),
        },
        {
          path: "movie-management/add",
          element: (
            <DashboardLayout>
              <AddMovie />
            </DashboardLayout>
          ),
        },
        {
          path: "movie-management/edit/:id",
          element: (
            <DashboardLayout>
              <EditMovie />
            </DashboardLayout>
          ),
        },
        {
          path: "movie-management/show-time/:id",
          element: (
            <DashboardLayout>
              <CreateShowtime />
            </DashboardLayout>
          ),
        },
        {
          path: "showtime-management",
          element: (
            <DashboardLayout>
              <ShowtimeManagement />
            </DashboardLayout>
          ),
        },
      ],
    },

    // 404 PAGE
    { path: "*", element: <div>404 Not Found</div> },
  ]);
  return elements;
};

export default useRouterElements;
