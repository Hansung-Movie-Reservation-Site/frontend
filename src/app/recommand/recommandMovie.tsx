"use client";

import type React from "react";

export interface Movie {
  id: number;
  title: string;
  genre: string;
  director: string;
  year: number;
  rating: number;
  description: string;
  imageUrl: string;
  recommendationReason: string;
}

export const sampleMovies = [
  {
    id: 1,
    title: "Inception",
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    year: 2010,
    rating: 8.8,
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    recommendationReason:
      "Mind-bending plot with stunning visuals and a thought-provoking concept that challenges perception and reality.",
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    genre: "Drama",
    director: "Frank Darabont",
    year: 1994,
    rating: 9.3,
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    recommendationReason:
      "A timeless tale of hope, friendship, and perseverance that consistently ranks as one of the greatest films ever made.",
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "Action",
    director: "Christopher Nolan",
    year: 2008,
    rating: 9.0,
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    recommendationReason:
      "Heath Ledger's iconic performance as the Joker elevates this superhero film into a complex crime thriller with moral depth.",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    genre: "Crime",
    director: "Quentin Tarantino",
    year: 1994,
    rating: 8.9,
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    recommendationReason:
      "Revolutionary non-linear storytelling with unforgettable dialogue and characters that redefined independent cinema.",
  },
  {
    id: 5,
    title: "Parasite",
    genre: "Drama",
    director: "Bong Joon Ho",
    year: 2019,
    rating: 8.6,
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    recommendationReason:
      "A masterful blend of dark comedy, social commentary, and suspense that made history as the first non-English language film to win Best Picture.",
  },
];

interface RecommendationResultProps {
  movie: Movie | null;
  onGetAnotherRecommendation: () => void;
  onBackToHome: () => void;
  choiceRecommand: number;
  setChoiceRecommand: React.Dispatch<React.SetStateAction<number>>;
}

export default function RecommendMovie({
  movie,
  onGetAnotherRecommendation,
  onBackToHome,
  choiceRecommand,
  setChoiceRecommand,
}: RecommendationResultProps) {
  if (!movie) {
    return <div className="text-white text-center">Loading recommendation...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Your Movie Recommendation
        </h2>
        <button
          onClick={onBackToHome}
          className="px-4 py-2 rounded-md border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Back to Home
        </button>
      </div>

      <div className="bg-gray-800/80 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img
              src={movie?.imageUrl || "/placeholder.svg"}
              alt={movie?.title || "Movie poster"}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold text-white">
              {movie?.title} {movie?.year ? `(${movie.year})` : ""}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-100 rounded text-sm">
                {movie.genre}
              </span>
              <span className="px-2 py-1 bg-gray-600/50 text-gray-200 rounded text-sm">
                ★ {movie.rating}/10
              </span>
            </div>
            <p className="mt-4 text-gray-300">
              <span className="font-semibold">Director:</span> {movie.director}
            </p>
            <p className="mt-6 text-gray-300">{movie.description}</p>

            <div className="mt-8 border-t border-gray-700 pt-6">
              <h4 className="text-xl font-semibold text-white mb-2">Why We Recommend This</h4>
              <p className="text-gray-300 italic">{movie.recommendationReason}</p>
            </div>

            <div className="mt-8">
              <button
                onClick={onGetAnotherRecommendation}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Get Another Recommendation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
