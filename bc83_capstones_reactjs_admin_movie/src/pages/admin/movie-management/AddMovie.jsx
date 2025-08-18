import React, { useState, useEffect } from "react";
import { X, Upload, Star, Calendar, Clock, Film } from "lucide-react";

const AddMovie = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    tenPhim: "",
    trailer: "",
    hinhAnh: "",
    moTa: "",
    ngayKhoiChieu: "",
    danhGia: 5,
    hot: false,
    dangChieu: false,
    sapChieu: false,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData((prev) => ({
          ...prev,
          hinhAnh: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenPhim.trim()) {
      newErrors.tenPhim = "Tên phim không được để trống";
    }

    if (!formData.trailer.trim()) {
      newErrors.trailer = "Trailer không được để trống";
    }

    if (!formData.hinhAnh) {
      newErrors.hinhAnh = "Hình ảnh không được để trống";
    }

    if (!formData.moTa.trim()) {
      newErrors.moTa = "Mô tả không được để trống";
    }

    if (!formData.ngayKhoiChieu) {
      newErrors.ngayKhoiChieu = "Ngày khởi chiếu không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newMovie = {
      tenPhim: formData.tenPhim,
      trailer: formData.trailer,
      moTa: formData.moTa,
      ngayKhoiChieu: formData.ngayKhoiChieu,
      danhGia: parseInt(formData.danhGia),
      hot: formData.hot,
      dangChieu: formData.dangChieu,
      sapChieu: formData.sapChieu,
      hinhAnh: formData.hinhAnh,
      maNhom: "GP00",
    };

    onAdd(newMovie);
  };

  const handleReset = () => {
    setFormData({
      tenPhim: "",
      trailer: "",
      hinhAnh: "",
      moTa: "",
      ngayKhoiChieu: "",
      danhGia: 5,
      hot: false,
      dangChieu: false,
      sapChieu: false,
    });
    setImagePreview("");
    setErrors({});
  };

  // Auto scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] overflow-y-auto animate-in fade-in duration-300">
      <div className="min-h-screen flex items-start justify-center p-4 pt-8 pb-8">
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl w-full max-w-4xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600/20 to-purple-600/20 border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Film className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Thêm Phim Mới</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Movie Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Film className="w-4 h-4 inline mr-2" />
                      Tên Phim
                    </label>
                    <input
                      type="text"
                      name="tenPhim"
                      value={formData.tenPhim}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      placeholder="Nhập tên phim..."
                    />
                    {errors.tenPhim && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.tenPhim}
                      </p>
                    )}
                  </div>

                  {/* Trailer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      📹 URL Trailer
                    </label>
                    <input
                      type="url"
                      name="trailer"
                      value={formData.trailer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {errors.trailer && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.trailer}
                      </p>
                    )}
                  </div>

                  {/* Release Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Ngày Khởi Chiếu
                    </label>
                    <input
                      type="date"
                      name="ngayKhoiChieu"
                      value={formData.ngayKhoiChieu}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                    {errors.ngayKhoiChieu && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.ngayKhoiChieu}
                      </p>
                    )}
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Star className="w-4 h-4 inline mr-2" />
                      Đánh Giá (1-10)
                    </label>
                    <input
                      type="number"
                      name="danhGia"
                      min="1"
                      max="10"
                      value={formData.danhGia}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Movie Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Upload className="w-4 h-4 inline mr-2" />
                      Hình Ảnh Phim
                    </label>

                    {imagePreview && (
                      <div className="mb-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 transition-all"
                    />
                    {errors.hinhAnh && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.hinhAnh}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      Chỉ chấp nhận file ảnh (JPG, PNG, GIF)
                    </p>
                  </div>

                  {/* Movie Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">
                      Trạng Thái Phim
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="dangChieu"
                          checked={formData.dangChieu}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                        />
                        <span className="text-gray-300">🎬 Đang Chiếu</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="sapChieu"
                          checked={formData.sapChieu}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                        />
                        <span className="text-gray-300">🔜 Sắp Chiếu</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="hot"
                          checked={formData.hot}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                        />
                        <span className="text-gray-300">🔥 Phim Hot</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📝 Mô Tả Phim
                </label>
                <textarea
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                  placeholder="Nhập mô tả chi tiết về phim..."
                />
                {errors.moTa && (
                  <p className="text-red-400 text-sm mt-1">{errors.moTa}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Thêm Phim
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;
