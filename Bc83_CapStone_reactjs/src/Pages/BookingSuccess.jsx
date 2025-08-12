import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/ui.css";
import "../assets/success.css";

function fmtCurrency(n){ return (n || 0).toLocaleString("vi-VN") + "đ"; }

export default function BookingSuccess(){
  const nav = useNavigate();
  const { state } = useLocation();
  const order = useMemo(() => {
    if (state?.order) return state.order;
    const raw = localStorage.getItem("lastOrder");
    return raw ? JSON.parse(raw) : null;
  }, [state]);

  useEffect(()=>{
    if (!order) {
      // Không có dữ liệu -> về trang chủ
      nav("/", { replace: true });
    }
  }, [order, nav]);

  if (!order) return null;

  return (
    <>
      <Navbar />
      <div className="success-wrap">
        <div className="ticket-card">
          <div className="tick-left">
            <div className="ok-badge">✓</div>
            <h2>Đặt vé thành công!</h2>
            <p className="sub">Cảm ơn bạn đã đặt vé tại <b>MovieHands</b>.</p>

            <div className="mv-box">
              <img src={order.movie.poster} alt={order.movie.title} />
              <div>
                <div className="mv-title">{order.movie.title}</div>
                <div className="muted">{order.theater.cumRap} • {order.theater.rap}</div>
                <div className="muted">{order.theater.address || ""}</div>
              </div>
            </div>

            <div className="rows">
              <div className="row"><span>Mã đặt chỗ</span><b>{order.code}</b></div>
              <div className="row"><span>Suất chiếu</span><b>{order.schedule.date} {order.schedule.time}</b></div>
              <div className="row">
                <span>Ghế</span>
                <b>{order.seats.map(s => s.tenGhe).join(", ")}</b>
              </div>
              <div className="row"><span>Số vé</span><b>{order.seats.length}</b></div>
              <div className="row"><span>Tổng tiền</span><b>{fmtCurrency(order.total)}</b></div>
            </div>

            <div className="actions">
              <button className="btn primary" onClick={()=>nav("/")}>Về trang chủ</button>
              {/* Bạn có thể thêm trang lịch sử vé sau */}
              {/* <button className="btn ghost" onClick={()=>nav("/orders")}>Xem vé của tôi</button> */}
              <button className="btn ghost" onClick={()=>window.print()}>In vé</button>
            </div>
          </div>

          <div className="tick-right">
            <div className="qr">
              {/* Placeholder QR. Có thể thay bằng lib QR sau */}
              <div className="qr-inner">{order.code}</div>
            </div>
            <div className="muted small">Quét mã tại rạp để nhận vé</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
