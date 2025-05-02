
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTournament } from "@/context/TournamentContext";
import { useNavigate } from "react-router-dom";

export const TournamentAccess = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getTournamentByCode } = useTournament();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const tournament = await getTournamentByCode(code);
      if (tournament) {
        navigate(`/tournament/${tournament.id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Access Tournament</CardTitle>
        <CardDescription>
          Enter the secret code provided by the tournament admin to access details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Tournament Secret Code
            </label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code (e.g. ABC123)"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-cricket-700 hover:bg-cricket-800"
            disabled={isLoading}
          >
            {isLoading ? "Checking code..." : "Access Tournament"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
