import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { PATH } from "@/routes/path";
import { ROLE } from "@/constants/role";
import AuthLoadingScreen from "@/components/ui/AuthLoadingScreen";

const RootRedirect = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState(PATH.LOGIN);

  useEffect(() => {
    const checkAuth = async () => {
      // 🚀 HIỂN THỊ LOADING 1 GIÂY CHO MƯỢT MÀ
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 🎯 LOGIC CHUYỂN HƯỚNG THÔNG MINH
      const userString = localStorage.getItem("user");

      if (!userString) {
        // Chưa đăng nhập → về login
        setRedirectPath(PATH.LOGIN);
        setIsChecking(false);
        return;
      }

      let user;
      try {
        user = JSON.parse(userString);
      } catch (error) {
        // Data corrupt → xóa và về login
        localStorage.removeItem("user");
        setRedirectPath(PATH.LOGIN);
        setIsChecking(false);
        return;
      }

      // Kiểm tra user hợp lệ
      if (!user || !user.taiKhoan || !user.accessToken) {
        setRedirectPath(PATH.LOGIN);
        setIsChecking(false);
        return;
      }

      // Đã đăng nhập và có quyền admin → vào trang admin
      if (user.maLoaiNguoiDung === ROLE.ADMIN) {
        setRedirectPath(PATH.USER_MANAGEMENT);
      } else {
        // User thường → về login (vì này là admin app)
        setRedirectPath(PATH.LOGIN);
      }

      setIsChecking(false);
    };

    checkAuth();
  }, []);

  // 🚀 HIỂN THỊ LOADING SCREEN CHUYÊN NGHIỆP
  if (isChecking) {
    return <AuthLoadingScreen />;
  }

  return <Navigate to={redirectPath} replace />;
};

export default RootRedirect;
