import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Navbar = () => {
  // Adjust selector if your reducer key is different (e.g., store.auth.user)
  const userFromStore = useSelector(
    (store) => store.user ?? store.auth?.user ?? null
  );

  // Normalise user object for checks
  const user =
    userFromStore && Object.keys(userFromStore).length ? userFromStore : null;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Debug helper: remove after you verify user is present
    // eslint-disable-next-line no-console
    console.log("Navbar - user:", user);
    // close mobile menu when user changes (login/logout)
    setMobileOpen(false);
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="bg-[#24032f] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo (left) */}
          <Link to="/" className="text-white text-2xl font-bold tracking-wide">
            <i className="bx bxl-xing" /> DevDudes
          </Link>

          {/* Right side (desktop) - render menu only when user is logged in */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Messages Link */}
                <Link
                  to="/messages"
                  className="text-white hover:text-fuchsia-400 transition flex items-center gap-2"
                >
                  <i className="bx bx-message-dots text-xl" />{" "}
                  <span>Messages</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button
                    className="flex items-center space-x-2"
                    aria-haspopup="true"
                  >
                    <img
                      src={user.photoUrl || "/default-avatar.png"}
                      alt={user.fullName || "User"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                      className="w-10 h-10 rounded-full border-2 border-fuchsia-600 object-cover"
                    />
                    <i className="bx bx-chevron-down text-white" />
                  </button>

                  <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-fuchsia-800 hover:text-white transition"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        Logout <i className="bx bx-log-out" />
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              // intentionally render nothing on the right when not logged in
              <div style={{ width: 0 }} />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-white focus:outline-none"
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <i className="bx bx-menu text-3xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu: render only when user is logged in and mobileOpen is true */}
      {mobileOpen && user && (
        <div id="mobile-menu" className="md:hidden px-4 pb-4">
          <Link to="/messages" className="block text-white py-2">
            Messages
          </Link>
          <Link to="/profile" className="block text-white py-2">
            Profile
          </Link>
          <Link to="/connections" className="block text-white py-2">
            Connections
          </Link>
          <Link to="/premium" className="block text-white py-2">
            Premium
          </Link>
          <Link to="/requests" className="block text-white py-2">
            Requests
          </Link>
          <button onClick={handleLogout} className="block text-red-500 py-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
