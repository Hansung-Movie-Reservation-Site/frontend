import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">인증 시스템</h1>
          <p className="mt-2 text-gray-600">로그인하거나 새 계정을 만드세요</p>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/login" className="w-full">
            <Button className="w-full">로그인</Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button variant="outline" className="w-full">
              회원가입
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

