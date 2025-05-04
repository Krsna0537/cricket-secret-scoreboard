
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchCard } from "@/components/match/MatchCard";
import { Tournament, MatchStatus } from "@/types";

interface MatchesTabProps {
  tournament: Tournament;
}

export const MatchesTab: React.FC<MatchesTabProps> = ({ tournament }) => {
  // Filter matches by status
  const liveMatches = tournament.matches.filter(
    (m) => m.status === MatchStatus.LIVE
  );
  
  const upcomingMatches = tournament.matches.filter(
    (m) => m.status === MatchStatus.UPCOMING
  );
  
  const completedMatches = tournament.matches.filter(
    (m) => m.status === MatchStatus.COMPLETED
  );

  return (
    <Tabs defaultValue={liveMatches.length > 0 ? "live" : "upcoming"}>
      <TabsList className="mb-4">
        <TabsTrigger value="live" className="relative">
          Live
          {liveMatches.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {liveMatches.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="all">All Matches</TabsTrigger>
      </TabsList>

      <TabsContent value="live">
        {liveMatches.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No live matches at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                teams={tournament.teams}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="upcoming">
        {upcomingMatches.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No upcoming matches scheduled.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                teams={tournament.teams}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed">
        {completedMatches.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No completed matches yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                teams={tournament.teams}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="all">
        {tournament.matches.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No matches scheduled yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournament.matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                teams={tournament.teams}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
