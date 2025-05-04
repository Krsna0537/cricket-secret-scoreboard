
import React from "react";
import { Tournament } from "@/types";

interface TournamentHeaderProps {
  tournament: Tournament;
}

export const TournamentHeader: React.FC<TournamentHeaderProps> = ({ tournament }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          {tournament.logo && (
            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border">
              <img
                src={tournament.logo}
                alt={`${tournament.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{tournament.name}</h1>
            <p className="text-muted-foreground">
              {tournament.format.replace("_", " ").toUpperCase()} Format
            </p>
          </div>
        </div>
        
        {tournament.startDate && tournament.endDate && (
          <div className="text-right">
            <div className="text-sm font-medium">Tournament Dates</div>
            <div className="text-muted-foreground">
              {new Date(tournament.startDate).toLocaleDateString()} -{" "}
              {new Date(tournament.endDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
      
      {tournament.description && (
        <p className="text-muted-foreground mt-2">
          {tournament.description}
        </p>
      )}
      
      {tournament.location && (
        <div className="mt-2 text-sm bg-cricket-50 inline-block px-2 py-1 rounded-md">
          📍 {tournament.location}
        </div>
      )}
    </div>
  );
};
