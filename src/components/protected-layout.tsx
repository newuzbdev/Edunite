import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { AppLayout } from "@/shared/layout/app-layout"

export function ProtectedLayout() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout />
}

