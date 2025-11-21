import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"

interface PrivateRouteProps {
  children: React.ReactElement
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

