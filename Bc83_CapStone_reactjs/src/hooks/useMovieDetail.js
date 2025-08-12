import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetail } from "../Services/movie-detail.api";

export const useMovieDetail = (id) =>
  useQuery({
    queryKey: ["movie-detail", id],
    queryFn: () => fetchMovieDetail(id),
    enabled: !!id,
    staleTime: 60_000,
    retry: false,
  });
