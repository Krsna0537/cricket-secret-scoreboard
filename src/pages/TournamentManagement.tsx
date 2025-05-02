
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TournamentForm } from "@/components/tournament/TournamentForm";
import { TeamForm } from "@/components/team/TeamForm";
import { MatchForm } from "@/components/match/MatchForm";
import { ShareTournament } from "@/components/tournament/ShareTournament";
import { Match, MatchStatus, Team } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiveScoring } from "@/components/match/LiveScoring";
import { MatchCard } from "@/components/match/MatchCard";
import { PointsTable } from "@/components/tournament/PointsTable";

const TournamentManagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    tournaments,
    currentTournament,
    setCurrentTournament,
    isLoading,
    updateTournament,
    addTeam,
    updateTeam,
    deleteTeam,
    createMatch,
    updateMatch,
    generateRandomMatches,
  } = useTournament();

  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [scoringMatch, setScoringMatch] = useState<Match | null>(null);
  const [scoringDialogOpen, setScoringDialogOpen] = useState(false);

  // Load tournament data
  useEffect(() => {
    if (id && tournaments.length > 0) {
      const tournament = tournaments.find((t) => t.id === id);
      if (tournament) {
        setCurrentTournament(tournament);
      } else {
        navigate("/dashboard");
      }
    }
  }, [id, tournaments, setCurrentTournament, navigate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Redirect if tournament doesn't exist or not owned by current user
  useEffect(() => {
    if (
      !isLoading &&
      currentTournament &&
      currentTournament.createdBy !== currentUser?.id
    ) {
      navigate("/dashboard");
    }
  }, [currentTournament, currentUser, isLoading, navigate]);

  const handleUpdateTournament = async (data: Partial<typeof currentTournament>) => {
    if (currentTournament) {
      await updateTournament(currentTournament.id, data);
    }
  };

  const handleAddTeam = async (data: Partial<Team>) => {
    if (currentTournament) {
      await addTeam(currentTournament.id, data);
      setTeamDialogOpen(false);
      setEditingTeam(null);
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamDialogOpen(true);
  };

  const handleUpdateTeam = async (data: Partial<Team>) => {
    if (currentTournament && editingTeam) {
      await updateTeam(currentTournament.id, editingTeam.id, data);
      setTeamDialogOpen(false);
      setEditingTeam(null);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (currentTournament) {
      if (window.confirm("Are you sure you want to delete this team? All matches involving this team will also be deleted.")) {
        await deleteTeam(currentTournament.id, teamId);
      }
    }
  };

  const handleAddMatch = async (data: Partial<Match>) => {
    if (currentTournament) {
      await createMatch(currentTournament.id, data);
      setMatchDialogOpen(false);
      setEditingMatch(null);
    }
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setMatchDialogOpen(true);
  };

  const handleUpdateMatch = async (data: Partial<Match>) => {
    if (currentTournament && editingMatch) {
      await updateMatch(currentTournament.id, editingMatch.id, data);
      setMatchDialogOpen(false);
      setEditingMatch(null);
    }
  };

  const handleGenerateMatches = async () => {
    if (currentTournament) {
      if (currentTournament.teams.length < 2) {
        alert("At least 2 teams are required to generate matches.");
        return;
      }

      if (window.confirm("This will generate matches based on the tournament format. Continue?")) {
        await generateRandomMatches(currentTournament.id);
      }
    }
  };

  const handleManageScore = (match: Match) => {
    setScoringMatch(match);
    setScoringDialogOpen(true);
  };

  const handleUpdateScore = async (matchId: string, matchUpdate: Partial<Match>) => {
    if (currentTournament) {
      await updateMatch(currentTournament.id, matchId, matchUpdate);
      setScoringDialogOpen(false);
      setScoringMatch(null);
    }
  };

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

  // Filter matches by status
  const upcomingMatches = currentTournament.matches.filter(
    (m) => m.status === MatchStatus.UPCOMING
  );
  const liveMatches = currentTournament.matches.filter(
    (m) => m.status === MatchStatus.LIVE
  );
  const completedMatches = currentTournament.matches.filter(
    (m) => m.status === MatchStatus.COMPLETED
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{currentTournament.name}</h1>
            <p className="text-muted-foreground">
              Tournament Management Dashboard
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/tournament/${currentTournament.id}`)}
            >
              View Public Page
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="secondary"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TournamentForm
                  tournament={currentTournament}
                  onSubmit={handleUpdateTournament}
                  isLoading={isLoading}
                />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tournament Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Teams</span>
                      <span className="font-medium">
                        {currentTournament.teams.length}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Matches</span>
                      <span className="font-medium">
                        {currentTournament.matches.length}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Live Matches</span>
                      <span className="font-medium">
                        {liveMatches.length}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-medium">
                        {completedMatches.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Secret Code</span>
                      <span className="font-mono font-medium">
                        {currentTournament.secretCode}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {liveMatches.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Live Matches</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {liveMatches.slice(0, 2).map((match) => (
                          <div
                            key={match.id}
                            className="p-3 bg-red-50 border border-red-100 rounded-md"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">
                                  {currentTournament.teams.find(
                                    (t) => t.id === match.team1Id
                                  )?.name || "Team 1"}{" "}
                                  vs{" "}
                                  {currentTournament.teams.find(
                                    (t) => t.id === match.team2Id
                                  )?.name || "Team 2"}
                                </div>
                                {match.inning1 && (
                                  <div className="text-sm">
                                    {match.inning1.runs}/{match.inning1.wickets} ({match.inning1.overs})
                                  </div>
                                )}
                                {match.inning2 && (
                                  <div className="text-sm">
                                    {match.inning2.runs}/{match.inning2.wickets} ({match.inning2.overs})
                                  </div>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleManageScore(match)}
                                className="bg-cricket-700 hover:bg-cricket-800"
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Teams</h2>
              <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-cricket-700 hover:bg-cricket-800"
                    onClick={() => setEditingTeam(null)}
                  >
                    Add Team
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTeam ? "Edit Team" : "Add Team"}
                    </DialogTitle>
                  </DialogHeader>
                  <TeamForm
                    team={editingTeam || undefined}
                    onSubmit={editingTeam ? handleUpdateTeam : handleAddTeam}
                    isLoading={isLoading}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {currentTournament.teams.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <div className="bg-cricket-100 rounded-full p-3 inline-block mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cricket-800"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Teams Added</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add teams to your tournament. Each team can have multiple players.
                </p>
                <Button
                  onClick={() => setTeamDialogOpen(true)}
                  className="bg-cricket-700 hover:bg-cricket-800"
                >
                  Add Your First Team
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Short Name</TableHead>
                      <TableHead>Players</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTournament.teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {team.logo && (
                              <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <span>{team.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{team.shortName || "-"}</TableCell>
                        <TableCell>{team.players.length}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTeam(team)}
                            className="mr-2"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTeam(team.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">Matches</h2>
              <div className="flex gap-2">
                <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setEditingMatch(null)}
                    >
                      Add Match
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMatch ? "Edit Match" : "Add Match"}
                      </DialogTitle>
                    </DialogHeader>
                    <MatchForm
                      match={editingMatch || undefined}
                      teams={currentTournament.teams}
                      onSubmit={editingMatch ? handleUpdateMatch : handleAddMatch}
                      isLoading={isLoading}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={handleGenerateMatches}
                  className="bg-cricket-700 hover:bg-cricket-800"
                >
                  Generate Matches
                </Button>
              </div>
            </div>

            {currentTournament.matches.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <div className="bg-cricket-100 rounded-full p-3 inline-block mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cricket-800"
                  >
                    <rect width="18" height="18" rx="2" ry="2" x="3" y="3"/>
                    <line x1="3" x2="21" y1="9" y2="9"/>
                    <line x1="9" x2="9" y1="21" y2="9"/>
                    <line x1="15" x2="15" y1="21" y2="9"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Matches Scheduled</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add matches to your tournament or generate them automatically
                  based on the tournament format.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setMatchDialogOpen(true)}
                    variant="outline"
                  >
                    Add Match Manually
                  </Button>
                  <Button
                    onClick={handleGenerateMatches}
                    className="bg-cricket-700 hover:bg-cricket-800"
                    disabled={currentTournament.teams.length < 2}
                  >
                    Generate Matches
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="live" className="space-y-6">
                <TabsList>
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
                          onManage={handleManageScore}
                          isAdmin={true}
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
                          onManage={handleManageScore}
                          isAdmin={true}
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
                          onManage={handleManageScore}
                          isAdmin={true}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentTournament.matches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        teams={currentTournament.teams}
                        onManage={handleManageScore}
                        isAdmin={true}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>

          {/* Standings Tab */}
          <TabsContent value="standings">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Tournament Standings</h2>
            </div>

            {currentTournament.matches.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <h3 className="text-xl font-semibold mb-2">No Matches Available</h3>
                <p className="text-muted-foreground">
                  Add matches to view tournament standings and statistics.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                <PointsTable tournament={currentTournament} />
              </div>
            )}
          </TabsContent>

          {/* Share Tab */}
          <TabsContent value="share">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Share Tournament</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ShareTournament tournament={currentTournament} />
              <div className="bg-cricket-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">About Sharing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cricket-800 mt-1"
                    >
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" x2="12" y1="8" y2="16"/>
                      <line x1="8" x2="16" y1="12" y2="12"/>
                    </svg>
                    <span>
                      The secret code is <strong>required</strong> for anyone to
                      access your tournament.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cricket-800 mt-1"
                    >
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" x2="12" y1="8" y2="16"/>
                      <line x1="8" x2="16" y1="12" y2="12"/>
                    </svg>
                    <span>
                      Anyone with the code can view tournament details, but only
                      you can edit them.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cricket-800 mt-1"
                    >
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" x2="12" y1="8" y2="16"/>
                      <line x1="8" x2="16" y1="12" y2="12"/>
                    </svg>
                    <span>
                      Share the code with team members, players, and fans to give
                      them access.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cricket-800 mt-1"
                    >
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" x2="12" y1="8" y2="16"/>
                      <line x1="8" x2="16" y1="12" y2="12"/>
                    </svg>
                    <span>
                      Live score updates will be visible to all viewers in
                      real-time.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Live Scoring Dialog */}
      <Dialog
        open={scoringDialogOpen}
        onOpenChange={(open) => {
          setScoringDialogOpen(open);
          if (!open) setScoringMatch(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Live Scoring</DialogTitle>
          </DialogHeader>
          {scoringMatch && (
            <LiveScoring
              match={scoringMatch}
              teams={currentTournament.teams}
              onUpdate={handleUpdateScore}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TournamentManagement;
