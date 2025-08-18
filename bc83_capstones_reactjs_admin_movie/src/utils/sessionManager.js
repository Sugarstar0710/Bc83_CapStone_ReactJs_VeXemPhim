// Session management utilities
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 phút
export const ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // 5 phút kiểm tra 1 lần

export const sessionManager = {
  // Lưu thời gian đăng nhập
  setLoginTime: () => {
    localStorage.setItem("loginTime", Date.now().toString());
  },

  // Kiểm tra session có hết hạn không
  isSessionExpired: () => {
    const loginTime = localStorage.getItem("loginTime");
    if (!loginTime) return true;

    const elapsed = Date.now() - parseInt(loginTime);
    return elapsed > SESSION_TIMEOUT;
  },

  // Cập nhật thời gian hoạt động
  updateActivity: () => {
    localStorage.setItem("lastActivity", Date.now().toString());
  },

  // Kiểm tra hoạt động gần đây
  isActivityRecent: () => {
    const lastActivity = localStorage.getItem("lastActivity");
    if (!lastActivity) return false;

    const elapsed = Date.now() - parseInt(lastActivity);
    return elapsed < SESSION_TIMEOUT;
  },

  // Xóa tất cả session data
  clearSession: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("lastActivity");
    localStorage.removeItem("demoUsers");
  },

  // Khởi tạo session mới
  initSession: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    sessionManager.setLoginTime();
    sessionManager.updateActivity();
  },

  // Kiểm tra tính hợp lệ của session từ nhiều tab
  isSessionValidAcrossTabs: () => {
    const user = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");
    const lastActivity = localStorage.getItem("lastActivity");

    return (
      user &&
      loginTime &&
      lastActivity &&
      !sessionManager.isSessionExpired() &&
      sessionManager.isActivityRecent()
    );
  },
};

// Auto logout khi không hoạt động
export const setupAutoLogout = (onLogout) => {
  let timeoutId;
  let intervalId;

  const resetTimeout = () => {
    clearTimeout(timeoutId);
    sessionManager.updateActivity();

    timeoutId = setTimeout(() => {
      if (
        sessionManager.isSessionExpired() ||
        !sessionManager.isActivityRecent()
      ) {
        sessionManager.clearSession();
        onLogout();
      }
    }, SESSION_TIMEOUT);
  };

  // Kiểm tra session định kỳ (phòng trường hợp tab khác logout)
  const checkSessionPeriodically = () => {
    if (!sessionManager.isSessionValidAcrossTabs()) {
      sessionManager.clearSession();
      onLogout();
    }
  };

  // Lắng nghe các sự kiện hoạt động
  const events = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ];
  events.forEach((event) => {
    document.addEventListener(event, resetTimeout, true);
  });

  // Lắng nghe tab visibility change
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      // Khi tab được focus lại, kiểm tra session
      if (!sessionManager.isSessionValidAcrossTabs()) {
        sessionManager.clearSession();
        onLogout();
      } else {
        sessionManager.updateActivity();
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Khởi tạo timeout và interval đầu tiên
  resetTimeout();
  intervalId = setInterval(checkSessionPeriodically, ACTIVITY_CHECK_INTERVAL);

  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    events.forEach((event) => {
      document.removeEventListener(event, resetTimeout, true);
    });
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
};
