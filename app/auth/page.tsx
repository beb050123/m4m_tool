"use client"

import dynamic from "next/dynamic"

// Dynamically import the auth component to avoid hydration issues with localStorage
const AuthPage = dynamic(() => import("@/auth"), { ssr: false })

export default function Page() {
  return <AuthPage />
}

