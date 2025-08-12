import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../Pages/HomePage.jsx";
import LoginPage from "../Pages/LoginPage.jsx";
import RegisterPage from "../Pages/RegisterPage.jsx";
import MovieDetail from "../Pages/MovieDetail.jsx";
import BookingPage from "../Pages/BookingPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import BookingSuccess from "../Pages/BookingSuccess.jsx";
export default function AppRouter() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <Routes>
                {/* Home */}
                <Route index element={<HomePage />} />
                <Route path="home" element={<HomePage />} />
                <Route path="trangchu" element={<HomePage />} />

                <Route path="dangnhap" element={<LoginPage />} />
                <Route path="dangky" element={<RegisterPage />} />
                <Route path="chitietphim/:id" element={<MovieDetail />} />
                <Route path="detail/:id" element={<MovieDetail />} />

                 <Route element={<ProtectedRoute />}>
          <Route path="datve">
            <Route path=":id" element={<BookingPage />} />
            <Route path="thanhcong" element={<BookingSuccess />} />
          </Route>
        </Route>
                
                <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
            </Routes>
        </Suspense>
    );
}
