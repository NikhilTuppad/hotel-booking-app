import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from "../../api/authApi.js";
import { useTheme } from "../../context/ThemeContext.jsx";

import {
  Sun,
  Moon,
  Compass,
  Search,
  Menu,
  UserCircle2,
  Map,
  Home,
  LogOut,
} from "lucide-react";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
      setIsDropdownOpen(false);
    } catch (err) {
      console.log("Logout failed");
    }
  }

  // Active route
  const isActive = (path) => {
    if (path === "/account" && location.pathname === "/account") return true;

    if (
      path !== "/account" &&
      location.pathname.startsWith(path)
    )
      return true;

    return false;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800"
        : "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-transparent"
        }`}
    >
      <div className="max-w-[80rem] mx-auto flex items-center justify-between px-4 md:px-8 lg:px-12 py-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="text-brand"
          >
            <Compass
              className="w-8 h-8 md:w-9 md:h-9"
              strokeWidth={2.5}
            />
          </motion.div>

          <span className="font-bold text-xl md:text-2xl tracking-tight hidden sm:block text-gray-900 dark:text-white">
            Hotel<span className="text-brand">bazaar</span>
          </span>
        </Link>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 md:gap-4 border border-gray-300 dark:border-gray-700 rounded-full py-2 px-3 md:px-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">

          <div className="hidden sm:block hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-2 py-1 transition-colors">
            Anywhere
          </div>

          <div className="hidden sm:block border-l border-gray-300 dark:border-gray-600 h-6"></div>

          <div className="hidden sm:block hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-2 py-1 transition-colors">
            Any week
          </div>

          <div className="hidden sm:block border-l border-gray-300 dark:border-gray-600 h-6"></div>

          <div className="text-gray-500 dark:text-gray-400 font-light hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-2 py-1 transition-colors">
            Add guests
          </div>

          <button className="bg-brand text-white p-2 rounded-full ml-1 hover:bg-primaryDark transition-colors shadow-sm">
            <Search className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md transition-all active:scale-95"
            aria-label="Toggle dark mode"
          >
            <motion.div
              initial={false}
              animate={{
                rotate: theme === "dark" ? 180 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.div>
          </button>

          {/* USER MENU */}
          <div className="relative" ref={dropdownRef}>

            <button
              onClick={() =>
                setIsDropdownOpen(!isDropdownOpen)
              }
              className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-full py-1.5 md:py-2 pl-3 md:pl-4 pr-1.5 md:pr-2 hover:shadow-md transition-all bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 active:scale-95"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />

              {user ? (
                <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm uppercase shadow-sm">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <UserCircle2 className="w-7 h-7 md:w-8 md:h-8 text-gray-400 stroke-1" />
              )}
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 15,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="absolute right-0 top-[120%] w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden py-2"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-light">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/account"
                        onClick={() =>
                          setIsDropdownOpen(false)
                        }
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isActive("/account")
                          ? "bg-gray-50 dark:bg-gray-700 text-brand"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                      >
                        <UserCircle2 className="w-5 h-5" />
                        Profile
                      </Link>

                      <Link
                        to="/account/bookings"
                        onClick={() =>
                          setIsDropdownOpen(false)
                        }
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isActive("/account/bookings")
                          ? "bg-gray-50 dark:bg-gray-700 text-brand"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                      >
                        <Map className="w-5 h-5" />
                        My Bookings
                      </Link>

                      <Link
                        to="/account/places"
                        onClick={() =>
                          setIsDropdownOpen(false)
                        }
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isActive("/account/places")
                          ? "bg-gray-50 dark:bg-gray-700 text-brand"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                      >
                        <Home className="w-5 h-5" />
                        My Accommodations
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() =>
                          setIsDropdownOpen(false)
                        }
                        className="block px-4 py-3 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Log in
                      </Link>

                      <Link
                        to="/register"
                        onClick={() =>
                          setIsDropdownOpen(false)
                        }
                        className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </motion.header>
  );
}