
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTournament } from "@/context/TournamentContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchStatus } from "@/types";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { MatchesTab } from "@/components/tournament/MatchesTab";
import { TeamsTab } from "@/components/tournament/TeamsTab";
import { PointsTable } from "@/components/tournament/PointsTable";
import { MatchCard } from "@/components/match/MatchCard";

const TournamentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tournaments, currentTournament, getTournament, setCurrentTournament, isLoading } = useTournament();
  
  // Load tournament data
  useEffect(() => {
    if (id) {
      // First, check if it's already in the current tournament
      if (currentTournament && currentTournament.id === id) {
        return;
      }
      
      // Next, check if we can find it in the loaded tournaments
      if (tournaments.length > 0) {
        const tournament = tournaments.find((t) => t.id === id);
        if (tournament) {
          setCurrentTournament(tournament);
          return;
        }
      }
      
      // If we couldn't find it, try to fetch it directly
      const fetchTournament = async () => {
        const result = await getTournament(id);
        if (!result) {
          navigate("/access");
        }
      };
      
      fetchTournament();
    }
  }, [id, tournaments, currentTournament, setCurrentTournament, getTournament, navigate]);

  if (!currentTournament || isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-cricket-700 border-t-transparent rounded-full"></div>
          <span className="ml-3">Loading tournament...</span>
        </div>
      </MainLayout>
    );
  }

  // Filter live matches for the highlight section
  const liveMatches = currentTournament.matches.filter(
    (m) => m.status === MatchStatus.LIVE
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pb-12">
        <TournamentHeader tournament={currentTournament} />

        {/* Live Matches Section */}
        {liveMatches.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse-gentle"></span>
              Live Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {liveMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  teams={currentTournament.teams}
                />
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="matches">
          <TabsList className="mb-6">
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
          </TabsList>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <MatchesTab tournament={currentTournament} />
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <TeamsTab tournament={currentTournament} />
          </TabsContent>

          {/* Standings Tab */}
          <TabsContent value="standings">
            <h2 className="text-xl font-bold mb-4">Tournament Standings</h2>
            
            {currentTournament.matches.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No matches have been played yet. Standings will be available once matches begin.
              </p>
            ) : (
              <PointsTable tournament={currentTournament} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TournamentView;
