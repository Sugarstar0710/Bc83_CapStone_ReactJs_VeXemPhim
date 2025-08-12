import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSeatMap } from "../hooks/useSeatMap";
import { bookTickets } from "../Services/booking.api";
import { useAuth } from "../auth/Auth";
import "../assets/ui.css";
import "../assets/booking.css";

const COLS = 16; // số cột ghế để render grid (API thường theo thứ tự phù hợp 16 cột)

export default function BookingPage(){
  const { id } = useParams();                 // maLichChieu
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError, refetch } = useSeatMap(id);
  const seats = data?.danhSachGhe || [];
  const info  = data?.thongTinPhim || {};     // { hinhAnh, tenPhim, tenCumRap, diaChi, ngayChieu, gioChieu, tenRap }

  // đếm ngược 10 phút
  const [remain, setRemain] = useState(10*60);
  useEffect(()=>{
    const t = setInterval(()=> setRemain((s)=> (s>0 ? s-1 : 0)), 1000);
    return ()=> clearInterval(t);
  }, []);
  useEffect(()=>{ if (remain === 0) setSelected([]); }, [remain]);
  const mm = String(Math.floor(remain/60)).padStart(2,"0");
  const ss = String(remain%60).padStart(2,"0");

  const [selected, setSelected] = useState([]); // array of seat objects

  const toggleSeat = (seat) => {
    if (seat.daDat) return;
    setSelected((curr) => {
      const exist = curr.find((s) => s.maGhe === seat.maGhe);
      if (exist) return curr.filter((s) => s.maGhe !== seat.maGhe);
      return [...curr, seat];
    });
  };

  const total = useMemo(() => selected.reduce((sum, s) => sum + (s.giaVe || 0), 0), [selected]);

  const onBook = async () => {
    if (!isAuthenticated) return; // đã có guard route; đề phòng F5
    if (!selected.length) return;

    try {
      const payload = {
        maLichChieu: Number(id),
        danhSachVe: selected.map(s => ({ maGhe: s.maGhe, giaVe: s.giaVe })),
      };
      await bookTickets(payload);
      alert("Đặt vé thành công! 🎉");
      navigate("/"); // hoặc điều hướng về lịch sử vé
    } catch (e) {
      console.error(e);
      alert(e?.message || "Đặt vé thất bại");
      refetch(); // reload sơ đồ
      setSelected([]);
    }
  };

  // render grid ghế theo 16 cột
  const seatCells = useMemo(() => {
    return seats.map((ghe, idx) => {
      const cls = [
        "seat",
        ghe.loaiGhe?.toLowerCase() === "vip" ? "vip" : "",
        ghe.daDat ? "booked" : "",
        selected.some(s => s.maGhe === ghe.maGhe) ? "selected" : "",
      ].join(" ").trim();

      return (
        <div
          key={ghe.maGhe}
          className={cls}
          style={{ gridColumn: (idx % COLS) + 1 }}
          onClick={() => toggleSeat(ghe)}
          title={`${ghe.tenGhe} • ${ghe.loaiGhe || "Thường"} • ${ghe.giaVe?.toLocaleString("vi-VN")}đ`}
        >
          {ghe.tenGhe}
        </div>
      );
    });
  }, [seats, selected]);

  return (
    <>
      <Navbar />
      <div className="booking-wrap">
        {isLoading && <div className="loading">Đang tải sơ đồ ghế…</div>}
        {isError && <div className="error">Không lấy được sơ đồ ghế. Thử lại nhé.</div>}

        {!isLoading && data && (
          <div className="booking-grid">
            {/* LEFT: Seat map */}
            <div className="seat-area">
              <div className="countdown">Thời gian giữ ghế: <b>{mm}:{ss}</b></div>
              <div className="screen" />

              <div className="seat-grid">{seatCells}</div>

              <div className="legend">
                <span><i className="box" /> Thường</span>
                <span><i className="box b-vip" /> VIP</span>
                <span><i className="box b-sel" /> Đang chọn</span>
                <span><i className="box b-book" /> Đã bán</span>
              </div>
            </div>

            {/* RIGHT: Summary */}
            <div className="summary">
              <div className="sum-title">Tóm tắt đặt vé</div>

              <div className="mv-line">
                <img src={info.hinhAnh} alt={info.tenPhim} />
                <div>
                  <div style={{fontWeight:700}}>{info.tenPhim}</div>
                  <div className="pair"><span>Ngày chiếu</span><span>{info.ngayChieu} {info.gioChieu}</span></div>
                  <div className="pair"><span>Rạp</span><span>{info.tenCumRap} - {info.tenRap}</span></div>
                </div>
              </div>

              <div className="pair" style={{marginTop:8}}>
                <span>Ghế đã chọn</span>
                <span>{selected.map(s => s.tenGhe).join(", ") || "-"}</span>
              </div>

              <div className="pair"><span>Số lượng</span><span>{selected.length}</span></div>
              <div className="pair"><span>Giá vé</span><span>{selected.length ? selected[0].giaVe?.toLocaleString("vi-VN") + "đ" : "-"}</span></div>

              <div className="total"><span>Tổng tiền</span><span>{total.toLocaleString("vi-VN")}đ</span></div>

              <button
                className="book-btn"
                onClick={onBook}
                disabled={!selected.length || remain === 0}
                title={!selected.length ? "Chọn ít nhất 1 ghế" : ""}
              >
                ĐẶT VÉ
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
