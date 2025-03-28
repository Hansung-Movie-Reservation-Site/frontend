"use client";

import { useEffect, useState } from "react";
import ChiceRecommand from "./choiceRecommand";
import RecommendationMovie, { sampleMovies } from "./recommandMovie";
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

export default function MovieRecommend() {
  const [choiceRecommand, setChoiceRecommand] = useState(0);
  const [recommendedMovie, setRecommendedMovie] = useState<Movie | null>(null);

  const getRandomMovie = () => {
    const randomIndex = Math.floor(Math.random() * sampleMovies.length);
    setRecommendedMovie(sampleMovies[randomIndex]);
    return sampleMovies[randomIndex];
  };
  useEffect(() => {
    if (choiceRecommand !== 0) {
      getRandomMovie();
    }
  }, [choiceRecommand]);

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      <BackgroundElements />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {choiceRecommand === 0 ? (
          <ChiceRecommand setChoiceRecommand={setChoiceRecommand} />
        ) : (
          <RecommendationMovie
            movie={recommendedMovie}
            onGetAnotherRecommendation={getRandomMovie}
            onBackToHome={() => setRecommendedMovie(null)}
            choiceRecommand={choiceRecommand}
            setChoiceRecommand={setChoiceRecommand}
          />
        )}
      </div>
    </div>
  );
}

function BackgroundElements() {
  return (
    <>
      <img
        alt="Background image of a cinema"
        src="/placeholder.svg?height=1500&width=2830"
        className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center opacity-30"
      />
      <div
        aria-hidden="true"
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-primary to-indigo-500 opacity-20"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-primary to-indigo-500 opacity-20"
        />
      </div>
    </>
  );
}
