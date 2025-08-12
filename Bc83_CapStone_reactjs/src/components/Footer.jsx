import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="foot-col">
          <div className="foot-brand">MovieHands</div>
          <p className="foot-text">Đặt vé nhanh – Trải nghiệm mượt. Cập nhật lịch chiếu liên tục từ hệ thống rạp.</p>
        </div>

        <div className="foot-col">
          <div className="foot-title">Khám phá</div>
          <ul className="foot-list">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/home">Phim</Link></li>
            <li><Link to="/trangchu">Rạp</Link></li>
          </ul>
        </div>

        <div className="foot-col">
          <div className="foot-title">Hỗ trợ</div>
          <ul className="foot-list">
            <li><a href="#">Câu hỏi thường gặp</a></li>
            <li><a href="#">Điều khoản</a></li>
            <li><a href="#">Bảo mật</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-copy">© {new Date().getFullYear()} MovieHands. All rights reserved.</div>
    </footer>
  );
}
