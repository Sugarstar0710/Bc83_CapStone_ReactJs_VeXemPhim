import { useQuery } from "@tanstack/react-query";
import { fetchSeatMap } from "../Services/booking.api";

export const useSeatMap = (showtimeId) =>
  useQuery({
    queryKey: ["seatmap", showtimeId],
    queryFn: () => fetchSeatMap(showtimeId),
    enabled: !!showtimeId,
    staleTime: 30_000,
    retry: false,
  });
