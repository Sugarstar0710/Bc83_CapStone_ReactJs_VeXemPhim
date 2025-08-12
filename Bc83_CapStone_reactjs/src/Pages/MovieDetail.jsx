import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovieDetail";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/ui.css";
import "../assets/movie-detail.css";

function toDateKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}
const fmtDay = (d) => new Intl.DateTimeFormat("vi-VN",{weekday:"short"}).format(d).replace(".","");
const fmtDM  = (d) => new Intl.DateTimeFormat("vi-VN",{day:"2-digit",month:"2-digit"}).format(d);
const fmtHM  = (d) => new Intl.DateTimeFormat("vi-VN",{hour:"2-digit",minute:"2-digit",hour12:false}).format(d);

export default function MovieDetail(){
  const { id } = useParams();
  const { data, isLoading, isError } = useMovieDetail(id);
  const info = data?.info || {};
  const heThongRapChieu = data?.showtimes?.heThongRapChieu || [];

  // Tập ngày duy nhất từ toàn bộ lịch chiếu
  const allDates = useMemo(() => {
    const map = new Map();
    heThongRapChieu.forEach(sys =>
      sys.cumRapChieu?.forEach(cr =>
        cr.lichChieuPhim?.forEach(lc => {
          const d = new Date(lc.ngayChieuGioChieu);
          const key = toDateKey(lc.ngayChieuGioChieu);
          if (!map.has(key)) map.set(key, d);
        })
      )
    );
    return Array.from(map.values()).sort((a,b)=>a-b);
  }, [heThongRapChieu]);

  const [tab, setTab] = useState("showtimes");     // overview | reviews | showtimes
  const [date, setDate] = useState(null);
  const [activeSystem, setActiveSystem] = useState(""); // lọc theo hệ thống rạp

  useEffect(() => { if (allDates.length && !date) setDate(allDates[0]); }, [allDates, date]);

  return (
    <>
      <Navbar />
      <div className="detail-wrap">
        {isLoading && <div className="loading">Đang tải chi tiết phim…</div>}
        {isError && <div className="error">Không lấy được dữ liệu phim.</div>}

        {!isLoading && !isError && (
          <div className="detail-grid">
            {/* Poster */}
            <div className="poster">
              <img src={info.hinhAnh || data?.showtimes?.hinhAnh} alt={info.tenPhim || data?.showtimes?.tenPhim} />
            </div>

            {/* Info + Tabs */}
            <div className="info">
              <h1 className="mv-title">{info.tenPhim || data?.showtimes?.tenPhim}</h1>
              {info.moTa && <p className="mv-desc">{info.moTa}</p>}

              <div className="tabs">
                <button className={tab==="overview" ? "tab active":"tab"} onClick={()=>setTab("overview")}>Overview</button>
                <button className={tab==="reviews"  ? "tab active":"tab"} onClick={()=>setTab("reviews")}>Reviews</button>
                <button className={tab==="showtimes"? "tab active":"tab"} onClick={()=>setTab("showtimes")}>Showtimes</button>
              </div>

              {tab==="overview" && (
                <div className="panel">
                  <p><b>Mã phim:</b> {info.maPhim || id}</p>
                  {info.ngayKhoiChieu && <p><b>Khởi chiếu:</b> {new Date(info.ngayKhoiChieu).toLocaleDateString("vi-VN")}</p>}
                  {typeof info.danhGia==="number" && <p><b>Đánh giá:</b> ★ {info.danhGia}</p>}
                </div>
              )}

              {tab==="reviews" && (
                <div className="panel">
                  <p>Chưa kết nối tính năng reviews. Bạn có thể demo form đánh giá tại đây 😊</p>
                </div>
              )}

              {tab==="showtimes" && (
                <div className="panel">
                  {/* strip chọn ngày */}
                  <div className="date-strip">
                    {allDates.map(d => {
                      const key = toDateKey(d.toISOString());
                      const active = date && toDateKey(date.toISOString())===key;
                      return (
                        <button key={key} className={active?"date active":"date"} onClick={()=>setDate(d)}>
                          <div className="d1">{fmtDM(d)}</div>
                          <div className="d2">{fmtDay(d)}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* strip lọc theo hệ thống rạp */}
                  <div className="cinema-strip" style={{marginTop:8, marginBottom:8}}>
                    <button
                      className={`cinema-item ${!activeSystem ? "active":""}`}
                      onClick={()=>setActiveSystem("")}
                    >Tất cả</button>
                    {heThongRapChieu.map(sys=>(
                      <button
                        key={sys.maHeThongRap}
                        className={`cinema-item ${activeSystem===sys.maHeThongRap?"active":""}`}
                        onClick={()=>setActiveSystem(sys.maHeThongRap)}
                        title={sys.tenHeThongRap}
                      >
                        <img src={sys.logo} alt={sys.tenHeThongRap}/>
                      </button>
                    ))}
                  </div>

                  {/* danh sách lịch chiếu */}
                  <div className="sys-list">
                    {heThongRapChieu
                      .filter(sys => !activeSystem || sys.maHeThongRap===activeSystem)
                      .map(sys => (
                        <div className="sys" key={sys.maHeThongRap}>
                          <div className="sys-head">
                            <img src={sys.logo} alt={sys.tenHeThongRap}/>
                            <div className="sys-name">{sys.tenHeThongRap}</div>
                          </div>

                          <div className="clusters">
                            {sys.cumRapChieu?.map(cr => {
                              const times =
                                cr.lichChieuPhim?.filter(lc => {
                                  if (!date) return true;
                                  const d = new Date(lc.ngayChieuGioChieu);
                                  return toDateKey(d.toISOString()) === toDateKey(date.toISOString());
                                }) || [];

                              if (!times.length) return null;

                              return (
                                <div className="cluster" key={cr.maCumRap}>
                                  <div className="cluster-name">
                                    <div className="c1">{cr.tenCumRap}</div>
                                    <div className="c2">{cr.diaChi}</div>
                                  </div>
                                  <div className="times">
                                    {times
                                      .sort((a,b)=>new Date(a.ngayChieuGioChieu)-new Date(b.ngayChieuGioChieu))
                                      .map(lc => (
                                        <Link
                                          key={lc.maLichChieu}
                                          to={`/datve/${lc.maLichChieu}`}   // 👉 sang trang phòng vé
                                          className="time-btn"
                                          title={`Giá: ${lc.giaVe?.toLocaleString("vi-VN")}đ`}
                                        >
                                          {fmtHM(new Date(lc.ngayChieuGioChieu))}
                                        </Link>
                                      ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
