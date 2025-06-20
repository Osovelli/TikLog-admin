import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import useAuthStore from "@/store/authStore" // Adjust import path as needed

export const RedirectAuthenticatedUser = ({ children }) => {
  const { token } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const previousTokenRef = useRef(token)

  useEffect(() => {
    const authPages = ["/signin", "/signup", "/forgot-password"]

    // Detect when user logs out (token changes from truthy to falsy)
    if (previousTokenRef.current && !token) {
      console.log("User logged out, storing current path:", location.pathname)
      // Only store non-auth pages
      if (!authPages.includes(location.pathname)) {
        sessionStorage.setItem("lastVisitedPath", location.pathname)
        console.log("Stored path in sessionStorage:", location.pathname)
      }
    }

    // Detect when user logs in (token changes from falsy to truthy)
    if (!previousTokenRef.current && token) {
      console.log("User logged in, checking for redirect...")

      // Only redirect if currently on an auth page
      if (authPages.includes(location.pathname)) {
        const storedPath = sessionStorage.getItem("lastVisitedPath")
        console.log("Retrieved stored path:", storedPath)

        let redirectTo = storedPath || "/"

        // Prevent redirecting to auth pages
        if (authPages.includes(redirectTo)) {
          redirectTo = "/"
          console.log("Prevented redirect to auth page, using home instead")
        }

        console.log("Redirecting to:", redirectTo)

        // Use setTimeout to ensure the navigation happens after the current render cycle
        setTimeout(() => {
          navigate(redirectTo, { replace: true })
          // Clear the stored path after successful redirect
          sessionStorage.removeItem("lastVisitedPath")
          console.log("Redirect completed and path cleared")
        }, 0)
      }
    }

    // Update the previous token reference
    previousTokenRef.current = token
  }, [token, location.pathname, navigate])

  return children
}
