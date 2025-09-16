import { useState, useEffect } from "react";
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
  className={`fixed top-16 right-0 h-full w-72 bg-black border-l-2 border-white/10 font-normal z-50 transform transition-transform duration-300  ${
    showSlider ? "translate-x-0" : "translate-x-full"
  }`}
  style={{
    borderTopLeftRadius: "1.2rem",
    borderBottomLeftRadius: "1.2rem",
    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.32)",
  }}
>
  <div className="p-6 flex justify-between items-center border-b border-white/10">
    <h3 className="text-lg font-semibold text-white">Welcome </h3> 

    <button
      onClick={closeSlider}
      className="text-white hover:bg-white hover:text-black p-2 rounded-full transition text-2xl"
    >
      &times;
    </button>
  </div>
  <div className="flex flex-col">
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
          onClick={() => setShowAdminSubmenu(!showAdminSubmenu)}
          className="text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-6 rounded-t-lg font-medium"
        >
          Admin Options
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-black ${
            showAdminSubmenu ? "max-h-[500px] shadow-inner" : "max-h-0"
          }`}
        >
          <div className="pl-8 text-sm text-white">
            <button
              onClick={() => navigate("/manage-vehicles")}
              className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
            >
              Manage Vehicles
            </button>
            <button
              onClick={() => navigate("/manage-users")}
              className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
            >
              Manage Users
            </button>
            <button
              onClick={() => navigate("/manage-manufacturers")}
              className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
            >
              Manage Manufacturers
            </button>
            <button
              onClick={() => navigate("/advice-queue")}
              className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
            >
              Advice Request Queue
            </button>
            <button
              onClick={() => navigate("/manage-dealerships")}
              className="block py-2 px-2 hover:underline hover:bg-white hover:text-black transition rounded"
            >
              Manage Dealerships
            </button>
          </div>
        </div>
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
      {/* User Slider (desktop only) */}
      <div
        className={`fixed top-16 right-0 h-full w-72 bg-black border-l-2 border-white/10 font-normal z-50 transform transition-transform duration-300  ${
          showSlider ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          borderTopLeftRadius: "1.2rem",
          borderBottomLeftRadius: "1.2rem",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.32)",
        }}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
             Welcome
            {user && user.firstName ? `, ${user.firstName}` : ""} 
            <br/>
            {user && user.roles && user.roles.length > 0 ?  `Role: ${user.roles[0]}` : ""}
          </h3>
          <button
            onClick={closeSlider}
            className="text-white hover:bg-white hover:text-black p-2 rounded-full transition text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col">
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

              {/* ADMIN ONLY: Admin Options and submenu */}
              {user?.roles?.some(role => ["Manufacturer", "Administrator"].includes(role) ) && (
                <>
                  <button
                    onClick={() => setShowAdminSubmenu(!showAdminSubmenu)}
                    className="flex items-center justify-between w-full text-white py-4 border-b border-white/10 hover:bg-white hover:text-black transition text-left px-5 font-medium"
                  >
                     <span>Admin Options</span>
                      <ChevronDown
                        className={`w-5 h-5 ml-2 text-white transition-transform duration-200 ${showAdminSubmenuMobile ? "rotate-0" : ""}`}
                      />
                  </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out bg-black ${
                        showAdminSubmenu ? "max-h-[500px] shadow-inner" : "max-h-0"
                      }`}
                      >

                        <div className="pl-8 text-sm text-white">
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
        className={`fixed top-0 right-0 h-full w-64 bg-black  border-white/10  z-50 transform transition-transform duration-300 ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          borderTopLeftRadius: "1.2rem",
          borderBottomLeftRadius: "1.2rem",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.32)",
        }}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/10">
        
                 <div className="p-6 flex justify-between items-center border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
             Welcome
            {user && user.firstName ? `, ${user.firstName}` : ""} 
            <br/>
            {user && user.roles && user.roles.length > 0 ?  `Role: ${user.roles[0]}` : ""}
          </h3>
 
        </div>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="text-white hover:bg-white hover:text-black p-2 rounded-full transition text-2xl"
          >
            &times;
          </button>
        </div>
        <div className=" flex flex-col">
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
                    className={`overflow-hidden transition-all duration-300 ease-in-out bg-black ${
                      showAdminSubmenuMobile
                        ? "max-h-[500px] shadow-inner"
                        : "max-h-0"
                    }`}
                  >
                    <div className="pl-8 text-sm text-white">
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
