import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import useAuthStore from "@/store/AuthStore" // Adjust the import path as needed
import { Loader2 } from "lucide-react"

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, token, user, checkAuthStatus } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token in localStorage
        const storedToken = localStorage.getItem("token")

        /* if (storedToken && !isLoggedIn) {
          // If we have a token but user is not logged in, verify the token
          await checkAuthStatus()
        } */
      } catch (error) {
        console.error("Auth initialization failed:", error)
        // Clear invalid token
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [isLoggedIn, checkAuthStatus])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Check if user is authenticated
  const isAuthenticated = isLoggedIn && token && user

  if (!isAuthenticated) {
    // Redirect to login page with the current location as state
    // This allows redirecting back to the intended page after login
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  // User is authenticated, render the protected component
  return children
}
