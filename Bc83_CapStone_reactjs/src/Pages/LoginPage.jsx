import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../Services/auth.api";
import { useAuth } from "../auth/Auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const { login } = useAuth();
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const data = await loginApi({ taiKhoan, matKhau });
      // lưu tối thiểu: taiKhoan, hoTen, accessToken
      login({ taiKhoan: data.taiKhoan, hoTen: data.hoTen, accessToken: data.accessToken });
      const to = location.state?.from?.pathname || "/";
      navigate(to, { replace: true });
    } catch (e) {
      setErr(e?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{maxWidth:420, margin:"40px auto", padding:"0 16px"}}>
        <h2>Đăng nhập</h2>
        <form onSubmit={onSubmit} style={{display:"grid", gap:12, marginTop:12}}>
          <input placeholder="Tài khoản" value={taiKhoan} onChange={e=>setTaiKhoan(e.target.value)} />
          <input placeholder="Mật khẩu" type="password" value={matKhau} onChange={e=>setMatKhau(e.target.value)} />
          {err && <div style={{color:"#ef4444"}}>{err}</div>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
