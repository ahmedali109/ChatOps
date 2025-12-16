import { useEffect } from "react"
import { Routes , Route , Navigate } from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore"
import NavBar from "./components/NavBar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"

function App() {
  const {authUser , checkAuth , isCheckingAuthStatus} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({authUser});

  if(isCheckingAuthStatus && !authUser){
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    )
  }

  return (
    <>
        <NavBar />
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> :  <Navigate to="/login" replace />} />
          <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/" replace />} />
          <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/settings" element={ <SettingsPage /> } />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
        </Routes>
    </>
  )
}

export default App