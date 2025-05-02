
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TournamentAccess } from "@/components/tournament/TournamentAccess";

const AccessTournament = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          Access Tournament
        </h1>
        <p className="text-center mb-8 text-muted-foreground">
          Enter the secret code provided by the tournament administrator
          to access the tournament details.
        </p>
        <TournamentAccess />
      </div>
    </MainLayout>
  );
};

export default AccessTournament;
