
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTournament } from "@/context/TournamentContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchCard } from "@/components/match/MatchCard";
import { PointsTable } from "@/components/tournament/PointsTable";
import { MatchStatus, Team } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TournamentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tournaments, currentTournament, setCurrentTournament, isLoading } = useTournament();
  
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

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
      
      // If we couldn't find it, redirect to access page
      navigate("/access");
    }
  }, [id, tournaments, currentTournament, setCurrentTournament, navigate]);

  // Filter matches by status
  const liveMatches = currentTournament?.matches.filter(
    (m) => m.status === MatchStatus.LIVE
  ) || [];
  
  const upcomingMatches = currentTournament?.matches.filter(
    (m) => m.status === MatchStatus.UPCOMING
  ) || [];
  
  const completedMatches = currentTournament?.matches.filter(
    (m) => m.status === MatchStatus.COMPLETED
  ) || [];

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

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pb-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center gap-4">
              {currentTournament.logo && (
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border">
                  <img
                    src={currentTournament.logo}
                    alt={`${currentTournament.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{currentTournament.name}</h1>
                <p className="text-muted-foreground">
                  {currentTournament.format.replace("_", " ").toUpperCase()} Format
                </p>
              </div>
            </div>
            {currentTournament.startDate && currentTournament.endDate && (
              <div className="text-right">
                <div className="text-sm font-medium">Tournament Dates</div>
                <div className="text-muted-foreground">
                  {new Date(currentTournament.startDate).toLocaleDateString()} -{" "}
                  {new Date(currentTournament.endDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
          
          {currentTournament.description && (
            <p className="text-muted-foreground mt-2">
              {currentTournament.description}
            </p>
          )}
          
          {currentTournament.location && (
            <div className="mt-2 text-sm bg-cricket-50 inline-block px-2 py-1 rounded-md">
              📍 {currentTournament.location}
            </div>
          )}
        </div>

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
                        teams={currentTournament.teams}
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
                        teams={currentTournament.teams}
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
                        teams={currentTournament.teams}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all">
                {currentTournament.matches.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No matches scheduled yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentTournament.matches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        teams={currentTournament.teams}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            {currentTournament.teams.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No teams have been added to this tournament yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Teams</h2>
                  <Card>
                    <CardContent className="p-0">
                      <ul className="divide-y">
                        {currentTournament.teams.map((team) => (
                          <li
                            key={team.id}
                            className={`px-4 py-3 cursor-pointer ${
                              activeTeam?.id === team.id
                                ? "bg-cricket-50"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => setActiveTeam(team)}
                          >
                            <div className="flex items-center gap-3">
                              {team.logo ? (
                                <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                                  <img
                                    src={team.logo}
                                    alt={team.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-cricket-100 rounded-full flex items-center justify-center">
                                  <span className="font-bold text-cricket-800">
                                    {team.shortName || team.name.substring(0, 2)}
                                  </span>
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{team.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {team.players.length} Players
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Team Details</h2>
                  {activeTeam ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{activeTeam.name}</CardTitle>
                          {activeTeam.logo && (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={activeTeam.logo}
                                alt={activeTeam.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-lg font-medium mb-2">Players</h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {activeTeam.players.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={2}
                                    className="text-center text-muted-foreground"
                                  >
                                    No players added yet
                                  </TableCell>
                                </TableRow>
                              ) : (
                                activeTeam.players.map((player) => (
                                  <TableRow key={player.id}>
                                    <TableCell>{player.name}</TableCell>
                                    <TableCell>
                                      {player.role || "Not specified"}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        <p>Select a team to view details</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
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
