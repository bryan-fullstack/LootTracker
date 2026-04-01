"use client"

import { useState } from "react"
import { LoginView } from "@/components/login-view"
import { Dashboard } from "@/components/dashboard"

type ViewState = "login" | "dashboard"
type UserMode = "admin" | "guest" | null

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>("login")
  const [userMode, setUserMode] = useState<UserMode>(null)

  const handleLogin = (mode: "admin" | "guest") => {
    setUserMode(mode)
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setUserMode(null)
    setCurrentView("login")
  }

  if (currentView === "login") {
    return <LoginView onLogin={handleLogin} />
  }

  return (
    <Dashboard isGuestMode={userMode === "guest"} onLogout={handleLogout} />
  )
}
