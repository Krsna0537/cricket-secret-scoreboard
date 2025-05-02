
import React, { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
        <LoginForm />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Not an admin but want to access a tournament?</p>
          <a href="/access" className="text-cricket-700 hover:underline">
            Access with a tournament code
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
