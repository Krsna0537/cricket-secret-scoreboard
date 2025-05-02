
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-cricket-900 text-white p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bat"
            >
              <path d="M6.8 11a7 7 0 0 0 9.3 9.3"/>
              <path d="m12 6-0.5-4.3a1 1 0 0 0-1-0.8A14.4 14.4 0 0 0 2 9.2v0.4a1 1 0 0 0 0.9 1h0.3a7 7 0 0 0 4.6-1.7"/>
              <path d="M12 6l2-2a1 1 0 0 1 1.4 0l3.9 3.9a1 1 0 0 1 0 1.4L15 14"/>
              <path d="m12 6-2 2"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-cricket-900">CricketManager</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-cricket-700">
            Home
          </Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-cricket-700">
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/tournaments" className="text-gray-600 hover:text-cricket-700">
                  Tournaments
                </Link>
              )}
            </>
          ) : (
            <Link to="/access" className="text-gray-600 hover:text-cricket-700">
              Access Tournament
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-sm text-gray-600">
                {currentUser.name}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-cricket-500 text-cricket-800 hover:bg-cricket-50"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              onClick={() => navigate("/login")}
              className="bg-cricket-700 hover:bg-cricket-800"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
