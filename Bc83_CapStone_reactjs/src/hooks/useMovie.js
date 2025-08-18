import { useQuery } from "@tanstack/react-query";
import { fetchAllMovies } from "../Services/movie.api";

export const useMoviesHome = (maNhom = "GP00") =>
  useQuery({
    queryKey: ["movies", "all", maNhom],
    queryFn: () => fetchAllMovies(maNhom),
    staleTime: 60_000,
  });
