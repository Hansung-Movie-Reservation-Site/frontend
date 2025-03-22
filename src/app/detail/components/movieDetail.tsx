import Image from "next/image";
import { Star, StarHalf } from "lucide-react";

// 영화 정보
export const movieInfo = {
  title: "기생충 (Parasite)",
  rating: 4.5,
  director: "봉준호",
  releaseDate: "2019년 5월 30일",
  genres: "드라마, 스릴러, 코미디",
  runtime: "132분",
  cast: "송강호, 이선균, 조여정, 최우식, 박소담, 장혜진, 이정은",
  synopsis:
    "전원 백수로 살 길 막막하지만 사이는 좋은 기택(송강호) 가족. 장남 기우(최우식)에게 명문대생 친구가 연결시켜 준 고액 과외 자리는 모처럼 들어온 가뭄의 단비 같은 소식이다. 온 가족의 도움과 기대 속에 박사장(이선균) 집으로 향하는 기우. 그러나 이 만남을 시작으로 기택 가족과 박사장네 가족 사이에 예상치 못한 사건이 벌어지게 된다.",
  posterUrl: "/placeholder.svg?height=600&width=400",
};

interface MovieDetailsProps {
  title: string;
  rating: number;
  director: string;
  releaseDate: string;
  genres: string;
  runtime: string;
  cast: string;
  synopsis: string;
  posterUrl: string;
}

export default function MovieDetails({
  title,
  rating,
  director,
  releaseDate,
  genres,
  runtime,
  cast,
  synopsis,
  posterUrl,
}: MovieDetailsProps) {
  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Image
            src={posterUrl || "/placeholder.svg"}
            alt={`${title} 포스터`}
            width={400}
            height={600}
            className="rounded-lg shadow-lg w-full"
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
            <span className="text-lg font-medium">{rating}/5</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">감독</p>
              <p className="font-medium">{director}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">개봉일</p>
              <p className="font-medium">{releaseDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">장르</p>
              <p className="font-medium">{genres}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">러닝타임</p>
              <p className="font-medium">{runtime}</p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">출연진</h2>
            <p>{cast}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">줄거리</h2>
            <p className="text-gray-600">{synopsis}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
