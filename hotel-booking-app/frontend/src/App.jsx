import { Routes, Route } from "react-router-dom"
import './App.css'
import IndexPage from "./pages/IndexPage.jsx"
import LoginPage from "./pages/LoginPage";
import Layout from "./components/layout/Layout.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import axios from "axios";
import { UserContextProvider } from "./context/UserContext.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PlacesPage from "./pages/PlacesPage.jsx";
import PlacesFormPage from "./pages/PlacesFormPage.jsx";
import PlacePage from "./pages/PlacePage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import BookingPage from "./pages/BookingPage";
import WishlistPage from "./pages/WishlistPage.jsx";
import { Toaster } from 'react-hot-toast';
import { WishlistContextProvider } from "./context/WishlistContext.jsx";
import { RecentlyViewedContextProvider } from "./context/RecentlyViewedContext.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext";




axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function ThemedToaster() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
          color: isDark ? '#f8fafc' : '#1f2937',
          padding: '16px 24px',
          borderRadius: '100px',
          fontSize: '15px',
          fontWeight: '600',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: isDark ? '#1e293b' : '#fff',
          },
          duration: 4000,
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: isDark ? '#1e293b' : '#fff',
          },
          duration: 5000,
        },
      }}
    />
  );
}

function App() {

  return (
    <ThemeProvider>
      <UserContextProvider>
        <WishlistContextProvider>
          <RecentlyViewedContextProvider>
            <ThemedToaster />
            <Routes>

              <Route path="/" element={<Layout />}>
                <Route index element={<IndexPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={<ProfilePage />} />
                <Route path="/account/places" element={<PlacesPage />} />
                <Route path="/account/places/new" element={<PlacesFormPage />} />
                <Route path="/account/places/:id" element={<PlacesFormPage />} />
                <Route path="/place/:id" element={<PlacePage />} />
                <Route path="/account/bookings" element={<BookingsPage />} />
                <Route path="/account/bookings/:id" element={<BookingPage />} />
                <Route path="/account/wishlist" element={<WishlistPage />} />

              </Route>

            </Routes>
          </RecentlyViewedContextProvider>
        </WishlistContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  )
}

export default App
