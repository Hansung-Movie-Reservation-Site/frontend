"use client"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "../common/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import type { UserData } from "./dashboardFeatures"
import { updateUserProfile } from "./dashboardFeatures"

interface DashboardContentProps {
  user: UserData
  onLogout: () => void
  onUpdateUser: (field: string, value: string) => void
}

export const DashboardContent = ({ user, onLogout, onUpdateUser }: DashboardContentProps) => {
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // 프로필 정보 상태
  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email)
  const [profilePassword, setProfilePassword] = useState("")

  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleUpdateProfile = async (field: string) => {
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      let value = ""

      if (field === "username") {
        value = username
        if (!value.trim()) {
          throw new Error("이름을 입력해주세요.")
        }
      } else if (field === "email") {
        value = email
        if (!value.trim() || !value.includes("@")) {
          throw new Error("유효한 이메일을 입력해주세요.")
        }
      }

      if (!profilePassword) {
        throw new Error("현재 비밀번호를 입력해주세요.")
      }

      console.log("프로필 업데이트 시도:", {
        field,
        value,
        hasPassword: !!profilePassword,
      })

      const result = await updateUserProfile(field, value, profilePassword)

      if (result.success) {
        setSuccess(result.message)
        setProfilePassword("")

        // 성공 시 부모 컴포넌트에 알려 상태 업데이트
        onUpdateUser(field, value)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err.message || "업데이트 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      if (!currentPassword) {
        throw new Error("현재 비밀번호를 입력해주세요.")
      }

      if (!newPassword) {
        throw new Error("새 비밀번호를 입력해주세요.")
      }

      if (newPassword !== confirmPassword) {
        throw new Error("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.")
      }

      if (newPassword.length < 6) {
        throw new Error("비밀번호는 최소 6자 이상이어야 합니다.")
      }

      console.log("비밀번호 변경 시도:", {
        hasCurrentPassword: !!currentPassword,
        hasNewPassword: !!newPassword,
        newPasswordLength: newPassword.length,
        actualNewPassword: newPassword, // 실제 값 로깅 (개발 환경에서만 사용)
      })

      // 비밀번호 변경 시 value 파라미터에 새 비밀번호를 전달
      const result = await updateUserProfile("password", newPassword, currentPassword)

      if (result.success) {
        setSuccess(result.message)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err.message || "비밀번호 변경 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">대시보드</CardTitle>
        <CardDescription>환영합니다, {user.username}님!</CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 p-4">
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profilePassword">현재 비밀번호 (변경 시 필요)</Label>
              <Input
                id="profilePassword"
                type="password"
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">이름</Label>
              <div className="flex space-x-2">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
                <Button
                  onClick={() => handleUpdateProfile("username")}
                  disabled={loading || username === user.username || !profilePassword}
                  loading={loading}
                >
                  변경
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                />
                <Button
                  onClick={() => handleUpdateProfile("email")}
                  disabled={loading || email === user.email || !profilePassword}
                  loading={loading}
                >
                  변경
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 p-4">
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">현재 비밀번호</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호를 다시 입력하세요"
              />
            </div>

            <Button
              onClick={handleUpdatePassword}
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              loading={loading}
              className="w-full"
            >
              비밀번호 변경
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex flex-col space-y-2 pt-4">
        <Button onClick={onLogout} variant="outline" className="w-full">
          로그아웃
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          마지막 로그인: {new Date().toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  )
}

