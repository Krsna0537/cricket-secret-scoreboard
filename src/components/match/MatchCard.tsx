
import React from "react";
import { Match, MatchStatus, Team } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MatchCardProps {
  match: Match;
  teams: Team[];
  onManage?: (match: Match) => void;
  isAdmin?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  teams,
  onManage,
  isAdmin = false,
}) => {
  const team1 = teams.find((t) => t.id === match.team1Id);
  const team2 = teams.find((t) => t.id === match.team2Id);

  const statusStyles = {
    [MatchStatus.UPCOMING]: "bg-blue-100 text-blue-800",
    [MatchStatus.LIVE]: "bg-red-100 text-red-800 animate-pulse-gentle",
    [MatchStatus.COMPLETED]: "bg-green-100 text-green-800",
    [MatchStatus.ABANDONED]: "bg-gray-100 text-gray-800",
  };

  const statusLabels = {
    [MatchStatus.UPCOMING]: "Upcoming",
    [MatchStatus.LIVE]: "LIVE",
    [MatchStatus.COMPLETED]: "Completed",
    [MatchStatus.ABANDONED]: "Abandoned",
  };

  const formatDateTime = () => {
    if (!match.date) return "TBD";
    const formattedDate = new Date(match.date).toLocaleDateString();
    return match.time ? `${formattedDate}, ${match.time}` : formattedDate;
  };

  return (
    <Card className="border overflow-hidden h-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              statusStyles[match.status]
            }`}
          >
            {statusLabels[match.status]}
          </span>
          <span className="text-xs text-gray-500">{formatDateTime()}</span>
        </div>

        <div className="flex flex-col space-y-4 my-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {team1?.logo ? (
                <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <img
                    src={team1.logo}
                    alt={team1.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {team1?.shortName || team1?.name?.substring(0, 2) || "T1"}
                  </span>
                </div>
              )}
              <span className="font-medium truncate max-w-[100px]">
                {team1?.name || "Team 1"}
              </span>
            </div>
            <div>
              {match.inning1 && (
                <span className="text-sm font-semibold">
                  {match.inning1.runs}/{match.inning1.wickets} ({match.inning1.overs})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {team2?.logo ? (
                <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <img
                    src={team2.logo}
                    alt={team2.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {team2?.shortName || team2?.name?.substring(0, 2) || "T2"}
                  </span>
                </div>
              )}
              <span className="font-medium truncate max-w-[100px]">
                {team2?.name || "Team 2"}
              </span>
            </div>
            <div>
              {match.inning2 && (
                <span className="text-sm font-semibold">
                  {match.inning2.runs}/{match.inning2.wickets} ({match.inning2.overs})
                </span>
              )}
            </div>
          </div>
        </div>

        {match.venue && (
          <div className="text-xs text-gray-500 mt-2">{match.venue}</div>
        )}

        {match.result?.summary && (
          <div className="text-sm mt-2 p-2 bg-gray-50 rounded">
            {match.result.summary}
          </div>
        )}
      </CardContent>

      {isAdmin && (
        <CardFooter className="bg-gray-50 p-3 border-t">
          <Button
            onClick={() => onManage?.(match)}
            className="w-full text-xs bg-cricket-700 hover:bg-cricket-800"
            size="sm"
          >
            {match.status === MatchStatus.LIVE ? "Update Score" : "Manage Match"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
