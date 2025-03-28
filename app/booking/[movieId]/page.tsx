"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { selectMovie } from "@/app/redux/redux"
import { fetchMovies } from "@/app/redux/reduxService"
import { Loader2 } from "lucide-react"

export default function BookingPage({ params }: { params: { movieId: string } }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const movieId = Number.parseInt(params.movieId)

  useEffect(() => {
    const loadMovie = async () => {
      try {
        // Fetch all movies
        const movies = await fetchMovies()

        // Find the selected movie by ID
        const selectedMovie = movies.find((movie) => movie.id === movieId)

        if (selectedMovie) {
          // Dispatch the selected movie to Redux store
          dispatch(selectMovie(selectedMovie))

          // Redirect to the reservation page
          router.push("/reservation")
        } else {
          console.error("Movie not found")
          router.push("/")
        }
      } catch (error) {
        console.error("Error loading movie:", error)
        router.push("/")
      }
    }

    loadMovie()
  }, [dispatch, movieId, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">예매 페이지로 이동 중입니다...</span>
    </div>
  )
}

