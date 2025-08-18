import React, { useMemo, useState } from "react";
import "../assets/home.css";
import "../assets/ui.css";
import { useMoviesHome } from "../hooks/useMovie";
import MovieCard from "../components/Moviecard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const { data: all, isLoading, isError } = useMoviesHome("GP00");

  // --- Search ---
  const [q, setQ] = useState("");
  const normalizedQ = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!all) return [];
    if (!normalizedQ) return all;
    return all.filter(m => (m.title || "").toLowerCase().includes(normalizedQ));
  }, [all, normalizedQ]);

  const nowPlaying = useMemo(() => filtered.filter(m => m.dangChieu), [filtered]);
  const comingSoon = useMemo(() => filtered.filter(m => m.sapChieu), [filtered]);
  const isSearching = normalizedQ.length > 0;

  // Hero vẫn lấy từ toàn bộ danh sách
  const heroMovie = useMemo(() => (all?.find(m => m.hot) || all?.[0]), [all]);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div
          className="bg"
          style={{
            backgroundImage: heroMovie?.posterUrl ? `url(${heroMovie.posterUrl})` : "none",
            backgroundColor: heroMovie?.posterUrl ? "transparent" : "#111",
          }}
        />
        <div className="content">
          <div>
            <h1>MovieHands</h1>
            <p>Đặt vé nhanh – Trải nghiệm mượt.</p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* 🔎 Thanh tìm kiếm – đặt ngay dưới HERO */}
        <div className="section">
          <div className="section-head" style={{ gap: 12 }}>
            <div className="section-title">Tìm kiếm</div>
            <div style={{ marginLeft: "auto" }}>
              <SearchBar value={q} onChange={setQ} placeholder="Tìm phim theo tên..." />
            </div>
          </div>
        </div>

        {/* Nếu đang tìm kiếm: hiện một block Kết quả */}
        {isSearching ? (
          <div className="section">
            <div className="section-head">
              <div className="section-title">
                Kết quả tìm kiếm {filtered?.length ? `(${filtered.length})` : ""}
              </div>
            </div>

            {isLoading && <div className="loading">Đang tải danh sách phim…</div>}
            {isError && <div className="error">Không tải được dữ liệu. Kiểm tra Console/Network nhé.</div>}
            {!isLoading && !isError && (
              filtered.length ? (
                <div className="grid">
                  {filtered.map(m => <MovieCard key={m.id} movie={m} />)}
                </div>
              ) : (
                <div className="empty">Không tìm thấy phim phù hợp “{q}”.</div>
              )
            )}
          </div>
        ) : (
          <>
            {/* ĐANG CHIẾU */}
            <div className="section">
              <div className="section-head">
                <div className="section-title">Đang chiếu</div>
                <a className="link" href="#">Xem tất cả</a>
              </div>

              {isLoading && <div className="loading">Đang tải danh sách phim…</div>}
              {isError && <div className="error">Không tải được dữ liệu. Kiểm tra Console/Network nhé.</div>}
              {!isLoading && !isError && nowPlaying.length === 0 && (
                <div className="empty">Chưa có phim đang chiếu.</div>
              )}
              {!isLoading && !isError && nowPlaying.length > 0 && (
                <div className="grid">
                  {nowPlaying.map(m => <MovieCard key={m.id} movie={m} />)}
                </div>
              )}
            </div>

            {/* SẮP CHIẾU */}
            <div className="section">
              <div className="section-head">
                <div className="section-title">Sắp chiếu</div>
                <a className="link" href="#">Xem tất cả</a>
              </div>

              {isLoading && <div className="loading">Đang tải danh sách phim…</div>}
              {isError && <div className="error">Không tải được dữ liệu. Kiểm tra Console/Network nhé.</div>}
              {!isLoading && !isError && comingSoon.length === 0 && (
                <div className="empty">Chưa có phim sắp chiếu.</div>
              )}
              {!isLoading && !isError && comingSoon.length > 0 && (
                <div className="grid">
                  {comingSoon.map(m => <MovieCard key={m.id} movie={m} />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
