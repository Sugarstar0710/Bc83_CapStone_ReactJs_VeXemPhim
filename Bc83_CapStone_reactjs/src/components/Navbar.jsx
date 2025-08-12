import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/Auth";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">MovieHands</Link>

        <nav className="nav-links">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/home">Phim</NavLink>
          <NavLink to="/trangchu">Rạp</NavLink>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="btn ghost">Xin chào, {user?.hoTen || user?.taiKhoan}</span>
              <button className="btn ghost" onClick={logout}>Đăng xuất</button>
            </>
          ) : (
            <Link className="btn primary" to="/dangnhap">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}
