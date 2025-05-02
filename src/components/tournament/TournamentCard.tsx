
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tournament, TournamentFormat } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TournamentCardProps {
  tournament: Tournament;
  onManage?: (tournament: Tournament) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onManage,
  onDelete,
  isAdmin = false,
}) => {
  const navigate = useNavigate();

  const formatLabel = {
    [TournamentFormat.KNOCKOUT]: "Knockout",
    [TournamentFormat.LEAGUE]: "League",
    [TournamentFormat.GROUP_KNOCKOUT]: "Group + Knockout",
  };

  const handleView = () => {
    navigate(`/tournament/${tournament.id}`);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{tournament.name}</CardTitle>
            <CardDescription>
              {formatLabel[tournament.format]} Format
            </CardDescription>
          </div>
          {tournament.logo && (
            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
              <img
                src={tournament.logo}
                alt={`${tournament.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="text-sm text-gray-500 mb-3">
          <div className="flex justify-between mb-1">
            <span>Teams:</span>
            <span className="font-medium">{tournament.teams.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Matches:</span>
            <span className="font-medium">{tournament.matches.length}</span>
          </div>
        </div>
        {tournament.startDate && tournament.endDate && (
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 text-xs" 
          onClick={handleView}
        >
          View
        </Button>
        {isAdmin && (
          <>
            <Button
              variant="default"
              className="flex-1 text-xs"
              onClick={() => onManage?.(tournament)}
            >
              Manage
            </Button>
            <Button
              variant="outline"
              className="text-xs text-red-500 hover:text-red-600"
              onClick={() => onDelete?.(tournament.id)}
            >
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
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
