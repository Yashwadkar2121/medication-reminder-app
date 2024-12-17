import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  // Check if the user is logged in by checking for a token in localStorage
  const token = localStorage.getItem("token");
  const isLoggedIn = token !== null;

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page after logout
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Manage mobile menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg
          className="fill-current h-8 w-8 mr-2"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <span className="font-semibold text-xl tracking-tight">
          <Link to="/">Medication</Link>
        </span>
      </div>

      {/* Mobile menu button */}
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
          onClick={toggleMenu} // Toggle menu visibility on click
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      {/* Desktop navigation */}
      <div className="w-full hidden md:block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <Link
            to="/add"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            Add
          </Link>
          <Link
            to="/dash"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            DashBoard
          </Link>
        </div>
        <div className="space-x-2">
          {!isLoggedIn ? (
            <>
              <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
                <Link to="/signup">SignUp</Link>
              </button>
              <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
                <Link to="/login">Login</Link>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu links (visible when the menu is open) */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } w-full lg:hidden bg-teal-500 mt-4 p-4 rounded-lg md:flex md:items-center md:w-auto`}
      >
        <Link
          to="/add"
          className="block py-2 text-teal-200 hover:text-white"
          onClick={toggleMenu} // Close menu on item click
        >
          Add
        </Link>
        <Link
          to="/dash"
          className="block py-2 text-teal-200 hover:text-white"
          onClick={toggleMenu} // Close menu on item click
        >
          DashBoard
        </Link>
        {!isLoggedIn ? (
          <>
            <Link
              to="/signup"
              className="block py-2 text-teal-200 hover:text-white"
              onClick={toggleMenu} // Close menu on item click
            >
              SignUp
            </Link>
            <Link
              to="/login"
              className="block py-2 text-teal-200 hover:text-white"
              onClick={toggleMenu} // Close menu on item click
            >
              Login
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="block py-2 text-teal-200 hover:text-white"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
