import React, { useState, useEffect } from "react";

const AuthLoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(
    "Đang khởi tạo phiên..."
  );

  const messages = [
    "Đang khởi tạo phiên...",
    "Xác thực token...",
    "Kiểm tra quyền admin...",
    "Đang hoàn tất...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;

        // Cập nhật message theo progress
        if (newProgress <= 25) {
          setCurrentMessage(messages[0]);
        } else if (newProgress <= 50) {
          setCurrentMessage(messages[1]);
        } else if (newProgress <= 75) {
          setCurrentMessage(messages[2]);
        } else {
          setCurrentMessage(messages[3]);
        }

        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 20); // Update every 20ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-red-600/10 animate-pulse"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                rgba(255, 255, 255, 0.02) 40px,
                rgba(255, 255, 255, 0.02) 44px
              )`,
          }}
        ></div>
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* Cinema logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-full mb-4 animate-spin-slow">
            <span className="text-4xl animate-bounce">🎬</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
            VIET CHUONG CINEMA
          </h1>
          <p className="text-gray-400 text-sm">Admin Dashboard</p>
        </div>

        {/* Loading animation */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>

          {/* Dynamic Progress bar */}
          <div className="w-80 mx-auto bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Progress percentage */}
          <div className="text-gray-300 text-sm mb-2">{progress}%</div>
        </div>

        {/* Dynamic Loading text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white mb-2">
            🔐 {currentMessage}
          </h2>
          <p className="text-gray-400 text-sm">Vui lòng chờ trong giây lát</p>
        </div>

        {/* Security badges */}
        <div className="mt-8 flex justify-center space-x-4">
          <div className="px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full">
            <span className="text-green-400 text-xs font-medium">
              🛡️ Bảo mật
            </span>
          </div>
          <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 text-xs font-medium">🔒 Mã hóa</span>
          </div>
          <div className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full">
            <span className="text-purple-400 text-xs font-medium">
              ⚡ Nhanh chóng
            </span>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-30"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping opacity-25"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-20"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
