import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation, Link } from "react-router-dom";
import getImageUrl from "./getImageUrl";
import { useUser } from "../contexts/UserContext";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAdminSubmenu, setShowAdminSubmenu] = useState(false);
  const [showAdminSubmenuMobile, setShowAdminSubmenuMobile] = useState(false);
  
  const desktopScrollRef = useRef(null);
  const mobileScrollRef = useRef(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser } = useUser();
  // console.log("User from context in navbar:", user);

  // Only use 'user' from context for UI logic!
  useEffect(() => {
    // Just for scroll hiding logic
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) setShow(false);
      else setShow(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // Check if scrollable content exists
  useEffect(() => {
    const checkScrollable = () => {
      if (desktopScrollRef.current) {
        const element = desktopScrollRef.current;
        const isScrollable = element.scrollHeight > element.clientHeight;
        element.classList.toggle('scrollable', isScrollable);
      }
      if (mobileScrollRef.current) {
        const element = mobileScrollRef.current;
        const isScrollable = element.scrollHeight > element.clientHeight;
        element.classList.toggle('scrollable', isScrollable);
      }
    };

    // Check immediately and after a short delay to ensure content is loaded
    checkScrollable();
    const timeoutId = setTimeout(checkScrollable, 100);
    
    return () => clearTimeout(timeoutId);
  }, [showSlider, showMobileMenu, showAdminSubmenu, showAdminSubmenuMobile, user]);

  const handleUserClick = () => setShowSlider(true);
  const closeSlider = () => setShowSlider(false);

  const handleLogout = () => {
    Cookies.remove("auto-direct-token", { path: '' });
    Cookies.remove('auto-direct-userID', { path: '' });
    setUser(null); // <-- Context and UI update instantly!
    setShowSlider(false);
    setShowMobileMenu(false);
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-white text-black font-semibold  transition-transform duration-300 ${
          show ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="w-full px-4 ">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-5 ">
              <div className="flex items-center space-x-3 hover:bg-gray-200 inline-block rounded transition">
                <Link to="/">
                  <img
                    src={getImageUrl("../../public/assets/logo.png")}
                    alt="Autos Direct"
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-4">
                <Link
                  to="/browse"
                  className="inline-block py-2 px-4 text-black hover:bg-gray-200 rounded transition"
                >
                  Browse Cars
                </Link>
                <Link
                  to="/saved-cars"
                  className="inline-block py-2 px-4 text-black hover:bg-gray-200 rounded transition"
                >
                  Saved Cars
                </Link>
              {/* Commenting this out as we haven't gotten it functional
                <Link
                  to="/contact"
                  className="inline-block py-2 px-4 text-black hover:bg-gray-200 rounded transition"
                >
                  Contact Us
                </Link>
              */}
              </nav>
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4 pr-6">
              {/* User Welcome Text (desktop only) */}
              {user && (
                <div className="hidden md:flex items-center gap-3 text-sm bg-white px-4 py-3 rounded-xl transition-all duration-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-semibold text-sm leading-tight">
                      {user.firstName || 'User'}
                    </span>
                    <span className="text-gray-500 text-xs font-medium leading-tight">
                      {user.roles && user.roles.length > 0 ? user.roles[0] : 'User'}
                    </span>
                  </div>
                </div>
              )}

              {/* Hamburger for mobile */}
              <button
                className="md:hidden focus:outline-none"
                onClick={() => setShowMobileMenu(true)}
              >
                <svg
                  className="w-8 h-8 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>

              {/* User Icon (desktop only) */}
              <button
                onClick={handleUserClick}
                className="focus:outline-none hidden md:block"
              >
                <img
                  src={getImageUrl("../../public/assets/burgermenuicon.png")}
                  alt="User"
                  className="h-8 w-8 hover:shadow-md cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Slider (desktop only) */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-black border-l-2 border-white/10 font-normal z-50 transform transition-transform duration-300 flex flex-col ${
          showSlider ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          borderTopLeftRadius: "1.2rem",
          borderBottomLeftRadius: "1.2rem",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.32)",
        }}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/10 flex-shrink-0">
          <h3 className="text-lg font-semibold text-white">
            Menu
          </h3>
          <button
            onClick={closeSlider}
            className="text-white hover:bg-white hover:text-black p-2 rounded-full transition text-2xl w-10 h-10 flex items-center justify-center hover:rounded-full"
          >
            &times;
          </button>
        </div>
        <div ref={desktopScrollRef} className="flex flex-col flex-1 overflow-y-auto nav-scrollbar min-h-0 max-h-[calc(100vh-8rem)]">
          {!user ? (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setShowSlider(false);
                }}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-6 rounded-none font-medium"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setShowSlider(false);
                }}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-6 rounded-none font-medium"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowSlider(false);
                }}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-6 rounded-none font-medium"
              >
                Profile Page
              </button>
              <button
                onClick={() => {
                  navigate("manage-my-requests");
                  setShowSlider(false);
                }}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-6 rounded-none font-medium"
              >
                Manage My Requests
              </button>
              <button
                onClick={() => {
                  navigate("manage-my-purchases");
                  setShowSlider(false);
                }}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-6 rounded-none font-medium"
              >
                Manage My Purchases
              </button>
              <button
                onClick={() => {
                  navigate("my-support-inquiries");
                  setShowSlider(false);
                }}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-6 rounded-none font-medium"
              >
                My Support Inquiries
              </button>

              {/* ADMIN ONLY: Admin Options and submenu */}
              {user?.roles?.some(role => ["Manufacturer", "Administrator"].includes(role) ) && (
                <>
                  <button
                    onClick={() => setShowAdminSubmenu(!showAdminSubmenu)}
                    className="flex items-center justify-between w-full text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 font-medium"
                  >
                     <span>Admin Options</span>
                      <ChevronDown
                        className={`w-5 h-5 ml-2 text-white transition-transform duration-200 ${showAdminSubmenu ? "rotate-180" : ""}`}
                      />
                  </button>
                    <div
                      className={`transition-all duration-300 ease-in-out bg-black ${
                        showAdminSubmenu ? "max-h-[50vh] shadow-inner" : "max-h-0 overflow-hidden"
                      }`}
                      >

                        <div className="pl-8 text-sm text-white overflow-y-auto admin-submenu-scrollbar max-h-[50vh] pr-4 py-2">
                        {user?.roles?.some(role => ["Manufacturer", "Administrator"].includes(role) ) && (
                          <button
                            onClick={() => navigate("/manage-vehicles")}
                            className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                          >
                            Manage Vehicles
                          </button>
                        )}

                        {user?.roles?.some(role => [ "Administrator"].includes(role) ) && (
                          <button
                            onClick={() => navigate("/manage-users")}
                            className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                          >
                            Manage Users
                          </button>
                        )}

                        {user?.roles?.some(role => [ "Administrator"].includes(role) ) && (
                          <button
                            onClick={() => navigate("/manage-manufacturers")}
                            className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                          >
                            Manage Manufacturers
                          </button>
                        )}

                      {user?.roles?.some(role => [ "Administrator"].includes(role) ) && (
                          <button
                            onClick={() => navigate("/advice-queue")}
                            className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                            >
                            Advice Request Queue
                          </button>
                        )}

                        {user?.roles?.some(role => [ "Administrator"].includes(role) ) && (
                        <button onClick={() => navigate("/manage-dealerships")} className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded" >
                          Manage Dealerships
                        </button>
                        )}

                        {user?.roles?.some(role => [ "Administrator"].includes(role) ) && (
                        <button onClick={() => navigate("/order-management")} className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded" >
                          Order Management
                        </button>
                        )}

                        {user?.roles?.some(role => [ "Administrator"].includes(role) ) && (
                        <button onClick={() => navigate("/logistics-dashboard")} className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded" >
                          Logistics Dashboard
                        </button>
                        )}
                        {user?.roles?.some(role => [ "Administrator"].includes(role) ) && (
                          <button
                            onClick={() => navigate("/test-drive-dashboard")}
                            className="block w-full text-left py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                          >
                            Test Drive Requests
                          </button>
                        )}

                        {user?.roles?.some(role => [ "Administrator"].includes(role) ) && (
                          <button
                            onClick={() => navigate("/customer-service-queue")}
                            className="block w-full text-left py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                          >
                            Customer Service Queue
                          </button>
                        )}
                        {user?.roles?.some(role => [ "Administrator"].includes(role) ) && (
                          <button
                            onClick={() => navigate("/chatbot-inquiries")}
                            className="block w-full text-left py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                          >
                            Chatbot Inquiries
                          </button>
                        )}

                        
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleLogout}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-6 rounded-b-lg font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Slider */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-black border-white/10 z-50 transform transition-transform duration-300 flex flex-col ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          borderTopLeftRadius: "1.2rem",
          borderBottomLeftRadius: "1.2rem",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.32)",
        }}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/10 flex-shrink-0">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-white">
              Menu
            </h3>
            {user && (
              <div className="flex items-center gap-3 text-sm text-white mt-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-7 h-7 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm leading-tight">{user.firstName || 'User'}</span>
                  <span className="text-xs text-gray-300 leading-tight">{user.roles && user.roles.length > 0 ? user.roles[0] : 'User'}</span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="text-white hover:bg-white hover:text-black p-2 rounded-full transition text-2xl w-10 h-10 flex items-center justify-center hover:rounded-full"
          >
            &times;
          </button>
        </div>
        <div ref={mobileScrollRef} className="flex flex-col flex-1 overflow-y-auto nav-scrollbar min-h-0 max-h-[calc(100vh-6rem)]">
          <Link
            to="/"
            onClick={() => setShowMobileMenu(false)}
            className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 rounded font-medium"
          >
            Home
          </Link>
         
       
            <Link
              to="/browse"
              onClick={() => setShowMobileMenu(false)}
              className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 rounded font-medium"
            >
              Browse Cars
            </Link>
       
          <Link
            to="/add"
            onClick={() => setShowMobileMenu(false)}
            className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 rounded font-medium"
          >
            Add Vehicle
          </Link>
          <Link
            to="/contact"
            onClick={() => setShowMobileMenu(false)}
            className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 rounded font-medium"
          >
            Contact Us
          </Link>
          {!user ? (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMobileMenu(false);
                }}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setShowMobileMenu(false);
                }}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 font-medium"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowMobileMenu(false);
                }}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 font-medium"
              >
                Profile Page
              </button>
              {/* ADMIN ONLY: Admin Options and submenu in mobile */}
              {user?.roles?.includes("Administrator") && (
                <>
              <button
                onClick={() => setShowAdminSubmenuMobile(!showAdminSubmenuMobile)}
                className="flex items-center justify-between w-full text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 font-medium"
              >
                <span>Admin Options</span>
                <ChevronDown
                  className={`w-5 h-5 ml-2 text-white transition-transform duration-200 ${showAdminSubmenuMobile ? "rotate-180" : ""}`}
                />
              </button>

                  <div
                    className={`transition-all duration-300 ease-in-out bg-black ${
                      showAdminSubmenuMobile
                        ? "max-h-[60vh] shadow-inner"
                        : "max-h-0 overflow-hidden"
                    }`}
                  >
                    <div className="pl-8 text-sm text-white overflow-y-auto nav-scrollbar max-h-[60vh] pr-4 py-2">
                      <button
                        onClick={() => navigate("/approve")}
                        className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                      >
                        Manage Vehicles
                      </button>
                      <button
                        onClick={() => navigate("/admin/users")}
                        className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                      >
                        Manage Users
                      </button>
                      <button
                        onClick={() => navigate("/admin/manufacturers")}
                        className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                      >
                        Manage Manufacturers
                      </button>
                      <button
                        onClick={() => navigate("/admin/advice-queue")}
                        className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                      >
                        Advice Request Queue
                      </button>
                      <button
                        onClick={() => navigate("/admin/dealerships")}
                        className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                      >
                        Manage Dealerships
                      </button>
                      <button
                        onClick={() => navigate("/admin/my-requests")}
                        className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
                      >
                        Manage My Requests
                      </button>
                    </div>
                  </div>
                </>
              )}
              <button
                onClick={handleLogout}
                className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 font-medium"
              >
                Logout 
              </button>

            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {(showSlider || showMobileMenu) && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40"
          onClick={() => {
            setShowSlider(false);
            setShowMobileMenu(false);
          }}
        ></div>
      )}
    </>
  );
};

export default Navbar;
