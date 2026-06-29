import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider }   from './context/AuthContext'
import Navbar             from './components/Navbar'
import ProtectedRoute     from './components/ProtectedRoute'
import Home               from './pages/Home'
import Login              from './pages/Login'
import Register           from './pages/Register'
import PostDetail         from './pages/PostDetail'
import CreatePost         from './pages/CreatePost'
import EditPost           from './pages/EditPost'
import MyPosts            from './pages/MyPosts'
import Profile            from './pages/Profile'
import Landing            from './pages/Landing'
import UserProfile        from './pages/UserProfile'

function AppContent() {
  const location = useLocation()
  const hideNavOn = ['/', '/landing', '/login', '/register']
  const showNav = !hideNavOn.includes(location.pathname)

  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        <Route path="/"       element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home"
          element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/create"
          element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/edit/:id"
          element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="/my-posts"
          element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
        <Route path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>} />  {/* ✅ added */}

        {/* Public Routes */}
        <Route path="/post/:id"        element={<PostDetail />} />
        <Route path="/user/:username"  element={<UserProfile />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}