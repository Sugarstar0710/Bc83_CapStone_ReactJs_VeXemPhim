import React from "react";

export default function SearchBar({ value, onChange, placeholder = "Tìm phim theo tên..." }) {
  return (
    <div className="search">
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")} aria-label="Xoá">
          ×
        </button>
      )}
    </div>
  );
}
