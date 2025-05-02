
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col items-center text-center py-16">
        <div className="bg-cricket-900 text-white p-4 rounded-2xl mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Cricket Tournament Manager</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Create, manage, and share cricket tournaments with secure access control.
          Track scores in real-time and generate leaderboards automatically.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full mb-12">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-3 text-cricket-900">For Administrators</h2>
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-green-600 mt-1"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Create tournaments with different formats
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-green-600 mt-1"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Add teams and players with detailed information
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-green-600 mt-1"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Schedule and manage matches with real-time scoring
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-green-600 mt-1"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Generate private links with secret codes for controlled access
              </li>
            </ul>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-cricket-700 hover:bg-cricket-800"
            >
              Login as Admin
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-3 text-cricket-900">For Viewers</h2>
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-green-600 mt-1"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Access tournament details with a secret code
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-green-600 mt-1"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                View team rosters, match schedules, and results
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-green-600 mt-1"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Get real-time match score updates
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-green-600 mt-1"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Check tournament standings and player statistics
              </li>
            </ul>
            <Button
              onClick={() => navigate("/access")}
              variant="outline"
              className="w-full border-cricket-700 text-cricket-900 hover:bg-cricket-50"
            >
              Access a Tournament
            </Button>
          </div>
        </div>

        <div className="bg-cricket-50 p-6 rounded-lg border max-w-3xl w-full">
          <h2 className="text-xl font-bold mb-2">How It Works</h2>
          <p className="mb-4">
            Our platform is designed to make cricket tournament management simple and secure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3">
              <div className="w-12 h-12 bg-cricket-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cricket-900 font-bold text-xl">1</span>
              </div>
              <h3 className="font-medium">Create Tournament</h3>
              <p className="text-sm text-muted-foreground">
                Set up your tournament with teams and format
              </p>
            </div>
            <div className="text-center p-3">
              <div className="w-12 h-12 bg-cricket-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cricket-900 font-bold text-xl">2</span>
              </div>
              <h3 className="font-medium">Share Access</h3>
              <p className="text-sm text-muted-foreground">
                Generate secret codes for viewers
              </p>
            </div>
            <div className="text-center p-3">
              <div className="w-12 h-12 bg-cricket-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cricket-900 font-bold text-xl">3</span>
              </div>
              <h3 className="font-medium">Manage Matches</h3>
              <p className="text-sm text-muted-foreground">
                Update scores and track statistics
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
