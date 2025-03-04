"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface UserData {
  userId: string
  username: string
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("인증에 실패했습니다.")
        }

        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error("사용자 정보를 가져오는데 실패했습니다:", error)
        localStorage.removeItem("token")
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">대시보드</CardTitle>
          <CardDescription>환영합니다, {user?.username}님!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">아이디</h3>
            <p className="text-gray-600">{user?.userId}</p>
          </div>
          <div>
            <h3 className="font-medium">이메일</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            로그아웃
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

