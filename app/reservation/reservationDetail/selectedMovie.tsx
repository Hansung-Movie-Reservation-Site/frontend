"use client"

import { useState } from "react"
import { Button } from "@/src/components/common/Button"
import { Search } from "lucide-react"
import Image from "next/image"

interface Movie {
  id: number
  title: string
  posterImage: string
  runtime: number
  releaseDate: string
  director: string
  genres: string
}

interface SelectedMovieProps {
  movies: Movie[]
  selectedMovie: Movie | null
  onSelectMovie: (movie: Movie) => void
  onNextStep: () => void
}

export default function SelectedMovie({ movies, selectedMovie, onSelectMovie, onNextStep }: SelectedMovieProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelectMovie = (movie: Movie) => {
    onSelectMovie(movie)
    setError("")
  }

  const handleNextStep = () => {
    if (!selectedMovie) {
      setError("영화를 선택해주세요.")
      return
    }

    setError("")
    onNextStep()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">영화 선택</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="영화 검색"
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className={`
              cursor-pointer transition-all duration-200 rounded-lg overflow-hidden
              ${selectedMovie?.id === movie.id ? "ring-2 ring-primary" : "hover:shadow-md"}
            `}
            onClick={() => handleSelectMovie(movie)}
          >
            <div className="relative h-64">
              {movie.posterImage ? (
                <Image
                  src={movie.posterImage || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=256&width=200&text=${encodeURIComponent(movie.title)}`
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  이미지 없음
                </div>
              )}
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm truncate">{movie.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {movie.releaseDate} | {movie.runtime}분
              </p>
            </div>
          </div>
        ))}

        {filteredMovies.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">검색 결과가 없습니다.</div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNextStep} disabled={!selectedMovie}>
          다음
        </Button>
      </div>
    </div>
  )
}

