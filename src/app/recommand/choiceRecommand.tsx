"use client";

import type React from "react";

interface ChoiceRecommandProps {
  setChoiceRecommand: React.Dispatch<React.SetStateAction<number>>;
}

export default function ChiceRecommand({ setChoiceRecommand }: ChoiceRecommandProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <h1 className="text-4xl font-bold mb-8">Choose Your Recommendation Type</h1>
      <div className="flex space-x-4">
        <button
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold"
          onClick={() => setChoiceRecommand(1)}
        >
          Random Movie
        </button>
        {/* Add more buttons for different recommendation types if needed */}
      </div>
    </div>
  );
}
