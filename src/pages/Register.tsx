
import React, { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
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
        <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
        <RegisterForm />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Already have an account?</p>
          <a href="/login" className="text-cricket-700 hover:underline">
            Sign in instead
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
