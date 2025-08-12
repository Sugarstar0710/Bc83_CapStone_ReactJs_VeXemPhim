import React from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div className="card">
      <Link to={`/chitietphim/${movie.id}`} className="block" title={movie.title}>
        <div className="poster">
          <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
          {typeof movie.rating === "number" && (
            <span className="badge">★ {movie.rating}</span>
          )}
        </div>
        <div className="card-body">
          <h3 className="title">{movie.title}</h3>
          {movie.releaseDate && (
            <div className="meta">
              {new Date(movie.releaseDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
