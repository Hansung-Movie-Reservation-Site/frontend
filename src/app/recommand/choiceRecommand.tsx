"use client";

interface RecommendationHomeProps {
  setChoiceRecommand: React.Dispatch<React.SetStateAction<number>>;
}

const recommendationCategories = [
  { name: "장르별 추천", href: "#" },
  { name: "감독별 추천", href: "#" },
  { name: "유사한 이야기의 영화 추천", href: "#" },
];

export default function choiceRecommand({ setChoiceRecommand }: RecommendationHomeProps) {
  return (
    <>
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          Movie Recommender
        </h2>
        <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
          Discover your next favorite film with our curated selection of critically acclaimed
          movies. Click one of the recommendation categories below to get started.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-2xl lg:mx-0 lg:max-w-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          {recommendationCategories.map((category, i) => (
            <button
              key={category.name}
              onClick={(e) => {
                e.preventDefault();
                setChoiceRecommand(i);
              }}
              className="group relative overflow-hidden rounded-md border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:border-white/30 hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <span className="relative z-10 flex items-center">
                {category.name}
                <span className="ml-2 opacity-70 transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
