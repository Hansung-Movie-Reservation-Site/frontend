"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import apiClient from "../common/apiClient";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendVerification = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    setVerificationLoading(true);
    setError("");
    const response = apiClient("/v1/email/send", { email: formData.email });
    console.log(response);
  };

  const handleVerifyCode = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!verificationCode) {
      setError("인증 코드를 입력해주세요.");
      return;
    }

    setVerificationLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "인증 코드 확인에 실패했습니다.");
      }

      setVerificationSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "인증 코드 확인 중 오류가 발생했습니다.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationSuccess) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          userId: formData.userId,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "회원가입에 실패했습니다.");
      }

      // 회원가입 성공 시 로그인 페이지로 리다이렉트
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>새 계정을 만드세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={verificationSent}
                />
                <Button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={verificationLoading || (verificationSent && verificationSuccess)}
                  className="whitespace-nowrap"
                >
                  {verificationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : verificationSent && !verificationSuccess ? (
                    "재전송"
                  ) : verificationSuccess ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    "인증코드 전송"
                  )}
                </Button>
              </div>
            </div>

            {verificationSent && !verificationSuccess && (
              <div className="space-y-2">
                <Label htmlFor="verificationCode">인증 코드</Label>
                <div className="flex space-x-2">
                  <Input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={verificationLoading || !verificationCode}
                  >
                    {verificationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "확인"}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">이름</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">아이디</Label>
              <Input
                id="userId"
                name="userId"
                type="text"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || !verificationSuccess}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  회원가입 중...
                </>
              ) : (
                "회원가입"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
