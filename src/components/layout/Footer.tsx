
import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="bg-cricket-900 text-white p-1 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
              <span className="text-sm font-semibold text-cricket-900">CricketManager</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              © {new Date().getFullYear()} Cricket Tournament Manager. All rights reserved.
            </p>
          </div>

          <div className="flex gap-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-cricket-700">
              Home
            </Link>
            <Link to="/about" className="text-sm text-gray-600 hover:text-cricket-700">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-cricket-700">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-gray-600 hover:text-cricket-700">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
