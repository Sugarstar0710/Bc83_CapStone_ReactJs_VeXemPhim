import { loginAuthAPI, registerAuthAPI } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE } from "@/constants/role";
import { PATH } from "@/routes/path";
import { sessionManager } from "@/utils/sessionManager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("login"); // "login" or "register"
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // 🧹 XÓA TẤT CẢ CACHE/DEMO DATA KHI COMPONENT MOUNT
  useEffect(() => {
    // Xóa tất cả session cũ và cache
    sessionManager.clearSession();

    // Xóa cache query cũ
    queryClient.removeQueries();
  }, [queryClient]);

  const {
    handleSubmit: handleLoginSubmit,
    register: registerLogin,
    reset: resetLogin,
  } = useForm({
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
    },
  });

  const {
    handleSubmit: handleRegisterSubmit,
    register: registerForm,
    reset: resetRegister,
  } = useForm({
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
      email: "",
      soDt: "",
      hoTen: "",
      maNhom: "GP00",
    },
  });

  const { mutate: loginUser } = useMutation({
    mutationFn: loginAuthAPI,
    onSuccess: (data) => {
      // 🔐 SỬ DỤNG SESSION MANAGER ĐỂ LƯU THÔNG TIN AN TOÀN
      sessionManager.initSession(data);
      toast.success("Đăng nhập thành công!");

      if (data.maLoaiNguoiDung === ROLE.ADMIN) {
        setTimeout(() => {
          navigate(PATH.USER_MANAGEMENT);
        }, 1500);
      } else {
        setTimeout(() => {
          navigate(PATH.HOME);
        }, 1500);
      }
    },
    onError: (error) => {
      toast.error("Tài khoản hoặc mật khẩu không đúng!");
    },
  });

  const { mutate: registerUser } = useMutation({
    mutationFn: registerAuthAPI,
    onSuccess: (response) => {
      // console.log("Register success response:", response);

      // Invalidate user-list cache để refresh danh sách khi vào trang admin
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      queryClient.invalidateQueries({ queryKey: ["user-search"] });

      toast.success("Đăng ký thành công! Hãy đăng nhập.");
      setActiveTab("login");
      resetRegister();
    },
    onError: (error) => {
      // console.error("Register error:", error);
      const errorMessage =
        error?.response?.data?.content ||
        error?.response?.data?.message ||
        "Đăng ký thất bại! Vui lòng thử lại.";
      toast.error(errorMessage);
    },
  });
  const onLoginSubmit = (data) => {
    // Validate
    if (!/^\w{4,}$/.test(data.taiKhoan)) {
      toast.error(
        "Tài khoản phải từ 4 ký tự trở lên, không chứa ký tự đặc biệt!"
      );
      return;
    }
    if (!/^.{6,}$/.test(data.matKhau)) {
      toast.error("Mật khẩu phải từ 6 ký tự trở lên!");
      return;
    }

    // 🔥 CHỈ SỬ DỤNG API THẬT - XÓA TẤT CẢ BACKUP/DEMO
    // Xóa session cũ trước khi đăng nhập mới
    sessionManager.clearSession();

    // Chỉ đăng nhập qua API server thật
    loginUser(data);
    resetLogin();
  };

  const onRegisterSubmit = (data) => {
    // Validate
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(data.taiKhoan)) {
      toast.error("Tài khoản phải từ 4-20 ký tự, chỉ gồm chữ, số, _");
      return;
    }
    if (!/^.{6,}$/.test(data.matKhau)) {
      toast.error("Mật khẩu phải từ 6 ký tự trở lên");
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
      toast.error("Email không hợp lệ");
      return;
    }
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(data.soDt)) {
      toast.error("Số điện thoại không hợp lệ (VD: 0912345678)");
      return;
    }
    if (!data.hoTen.trim()) {
      toast.error("Họ tên không được để trống");
      return;
    }

    // Gọi API đăng ký trực tiếp
    // console.log("Submitting register data:", data);

    const registerData = {
      taiKhoan: data.taiKhoan,
      matKhau: data.matKhau,
      email: data.email,
      soDt: data.soDt,
      hoTen: data.hoTen,
      maNhom: "GP00",
      maLoaiNguoiDung: "KhachHang", // Mặc định là khách hàng
    };

    // console.log("Final register data being sent:", registerData);
    registerUser(registerData);
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden flex items-center justify-center">
      {/* Base gradient overlay for cinema atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black/80 to-purple-900/40"></div>

      {/* Film strip pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(255, 255, 255, 0.05) 40px,
            rgba(255, 255, 255, 0.05) 44px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(255, 255, 255, 0.02) 40px,
            rgba(255, 255, 255, 0.02) 44px
          )`,
        }}
      ></div>

      {/* Theater lights effect */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-radial from-yellow-400/20 via-yellow-400/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-radial from-yellow-400/20 via-yellow-400/10 to-transparent rounded-full blur-2xl"></div>

      {/* Stage spotlight effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-radial from-yellow-300/15 via-yellow-500/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-red-400/15 via-red-600/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-radial from-purple-400/10 via-purple-600/5 to-transparent rounded-full blur-2xl"></div>

      {/* Curtain effect shadows */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black/60 to-transparent"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black/60 to-transparent"></div>

      {/* Center stage light */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-transparent via-yellow-900/5 to-transparent"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="backdrop-blur-xl bg-black/50 shadow-2xl border border-gray-600/30 overflow-hidden relative z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-yellow-600/10"></div>
          <CardHeader className="relative text-center pb-6 z-30">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
              🎬 Viet Chuong Cinema
            </CardTitle>
            <CardDescription className="text-gray-300 text-sm">
              Hệ thống quản lý rạp phim chuyên nghiệp
            </CardDescription>
          </CardHeader>

          {/* Tab Navigation */}
          <div className="flex mb-6 mx-6 relative z-40">
            <button
              onClick={() => {
                setActiveTab("login");
                if (showForgotPassword) {
                  setShowForgotPassword(false);
                  toast.success("✅ Đã quay lại chế độ đăng nhập bình thường!");
                }
              }}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-r border-blue-500"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 border-r border-gray-600"
              }`}
              style={{ pointerEvents: "auto", cursor: "pointer" }}
            >
              🔑 Đăng nhập
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
              }}
              disabled={false}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg transition-all duration-300 ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70"
              }`}
              style={{ pointerEvents: "auto", cursor: "pointer" }}
            >
              📝 Đăng ký
            </button>
          </div>

          <CardContent className="space-y-4 relative z-30">
            {/* console.log("Rendering content, activeTab:", activeTab) */}{" "}
            {/* Debug */}
            {activeTab === "login" ? (
              // Login Form
              <form
                onSubmit={handleLoginSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="loginTaiKhoan" className="text-gray-200">
                    Tài khoản
                  </Label>
                  <Input
                    id="loginTaiKhoan"
                    name="taiKhoan"
                    placeholder="Nhập tài khoản của bạn"
                    {...registerLogin("taiKhoan")}
                    className="h-11 bg-gray-900 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none rounded-md px-3"
                    autoComplete="username"
                    style={{ zIndex: 1 }}
                    onChange={(e) => {
                      // console.log("Input changed:", e.target.value);
                      registerLogin("taiKhoan").onChange(e);
                    }}
                    onFocus={() => {
                      // console.log("Input focused")
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginMatKhau" className="text-gray-200">
                    Mật khẩu
                  </Label>
                  <Input
                    id="loginMatKhau"
                    name="matKhau"
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    {...registerLogin("matKhau")}
                    className="h-11 bg-gray-900 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none rounded-md px-3"
                    autoComplete="current-password"
                    style={{ zIndex: 1 }}
                    onChange={(e) => {
                      // console.log("Password changed:", e.target.value);
                      registerLogin("matKhau").onChange(e);
                    }}
                    onFocus={() => {
                      // console.log("Password focused")
                    }}
                  />
                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        toast.info(
                          "� Chế độ khôi phục mật khẩu đã được kích hoạt! Liên hệ quản trị viên để được hỗ trợ.",
                          {
                            position: "top-center",
                            autoClose: 5000,
                          }
                        );
                      }}
                      className={`text-sm transition-colors duration-200 hover:underline ${
                        showForgotPassword
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-blue-400 hover:text-blue-300"
                      }`}
                    >
                      {showForgotPassword
                        ? "🔒 Đang khôi phục..."
                        : "🔐 Quên mật khẩu?"}
                    </button>
                  </div>
                </div>

                {/* Recovery mode notification */}
                {showForgotPassword && (
                  <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-3 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-yellow-300 flex items-center gap-2">
                        🔒 Chế độ khôi phục mật khẩu
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          toast.success(
                            "✅ Đã thoát khỏi chế độ khôi phục mật khẩu!"
                          );
                        }}
                        className="text-xs text-gray-400 hover:text-white transition-colors underline"
                      >
                        Hủy
                      </button>
                    </div>
                    <p className="text-xs text-yellow-400 mt-1">
                      Liên hệ admin@vietchuongcinema.com để được hỗ trợ
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  🎬 Đăng nhập hệ thống
                </Button>
              </form>
            ) : (
              // Register Form
              <form
                onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registerTaiKhoan">Tài khoản</Label>
                    <Input
                      id="registerTaiKhoan"
                      placeholder="Tài khoản"
                      {...registerForm("taiKhoan")}
                      className="h-11 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerMatKhau">Mật khẩu</Label>
                    <Input
                      id="registerMatKhau"
                      type="password"
                      placeholder="Mật khẩu"
                      {...registerForm("matKhau")}
                      className="h-11 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerHoTen">Họ và tên</Label>
                  <Input
                    id="registerHoTen"
                    placeholder="Nhập họ và tên của bạn"
                    {...registerForm("hoTen")}
                    className="h-11 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    placeholder="example@email.com"
                    {...registerForm("email")}
                    className="h-11 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerSoDt">Số điện thoại</Label>
                  <Input
                    id="registerSoDt"
                    placeholder="0912345678"
                    {...registerForm("soDt")}
                    className="h-11 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                  />
                </div>
                <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 p-3 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-blue-300 flex items-center gap-2">
                    👤 Tài khoản đăng ký sẽ có quyền{" "}
                    <span className="font-semibold text-green-300">
                      Khách hàng
                    </span>
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  🎭 Tạo tài khoản mới
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
