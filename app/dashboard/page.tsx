"use client"

import dynamic from "next/dynamic"

// Dynamically import the dashboard component to avoid hydration issues with localStorage
const DashboardPage = dynamic(() => import("@/dashboard"), { ssr: false })

export default function Page() {
  return <DashboardPage />
}

