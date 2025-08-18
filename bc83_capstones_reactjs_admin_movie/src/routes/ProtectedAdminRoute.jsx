import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROLE } from "@/constants/role";
import { PATH } from "@/routes/path";
import fetcher from "@/apis/fetcher";

const ProtectedAdminRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      try {
        // 🔐 KIỂM TRA XÁC THỰC VÀ QUYỀN ADMIN
        const userString = localStorage.getItem("user");
        
        // Nếu không có user trong localStorage
        if (!userString) {
          setIsValid(false);
          setIsChecking(false);
          return;
        }

        let user;
        try {
          user = JSON.parse(userString);
        } catch (error) {
          // Nếu data bị corrupt, xóa và redirect về login
          localStorage.removeItem("user");
          setIsValid(false);
          setIsChecking(false);
          return;
        }

        // Kiểm tra user có đầy đủ thông tin và có quyền admin
        if (!user || 
            !user.taiKhoan || 
            !user.accessToken || 
            user.maLoaiNguoiDung !== ROLE.ADMIN) {
          localStorage.removeItem("user");
          setIsValid(false);
          setIsChecking(false);
          return;
        }

        // 🚀 KIỂM TRA TOKEN VỚI SERVER (quan trọng!)
        try {
          // Gọi API để verify token và quyền
          const response = await fetcher.post("/QuanLyNguoiDung/ThongTinTaiKhoan", {
            taiKhoan: user.taiKhoan
          });

          // Kiểm tra response và quyền admin
          if (response.data?.content?.maLoaiNguoiDung === ROLE.ADMIN) {
            setIsValid(true);
          } else {
            // Token hợp lệ nhưng không phải admin
            localStorage.removeItem("user");
            setIsValid(false);
          }
        } catch (error) {
          // Token không hợp lệ hoặc API error
          console.error("Token validation failed:", error);
          localStorage.removeItem("user");
          setIsValid(false);
        }
      } catch (error) {
        console.error("Session validation error:", error);
        localStorage.removeItem("user");
        setIsValid(false);
      } finally {
        setIsChecking(false);
      }
    };

    validateSession();
  }, []);

  // 🔄 Hiển thị loading khi đang kiểm tra
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-white mt-4 text-lg">🔐 Đang xác thực phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  // ❌ Session không hợp lệ
  if (!isValid) {
    return <Navigate to={PATH.LOGIN} replace />;
  }

  // ✅ PASSED - User đã đăng nhập và có quyền admin
  return <Outlet />;
};

export default ProtectedAdminRoute;
