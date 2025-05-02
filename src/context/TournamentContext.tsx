
import React, { createContext, useState, useContext, useEffect } from "react";
import { Match, MatchStatus, Team, Tournament, TournamentFormat } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface TournamentContextType {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  isLoading: boolean;
  createTournament: (tournament: Partial<Tournament>) => Promise<Tournament>;
  updateTournament: (id: string, tournament: Partial<Tournament>) => Promise<Tournament>;
  deleteTournament: (id: string) => Promise<void>;
  getTournamentByCode: (code: string) => Promise<Tournament | null>;
  setCurrentTournament: (tournament: Tournament | null) => void;
  addTeam: (tournamentId: string, team: Partial<Team>) => Promise<Team>;
  updateTeam: (tournamentId: string, teamId: string, team: Partial<Team>) => Promise<Team>;
  deleteTeam: (tournamentId: string, teamId: string) => Promise<void>;
  createMatch: (tournamentId: string, match: Partial<Match>) => Promise<Match>;
  updateMatch: (tournamentId: string, matchId: string, match: Partial<Match>) => Promise<Match>;
  generateRandomMatches: (tournamentId: string) => Promise<Match[]>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

// Mock data storage - in a real app, this would be an API
let MOCK_TOURNAMENTS: Tournament[] = [];

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Load tournaments from localStorage on mount
  useEffect(() => {
    const savedTournaments = localStorage.getItem("cricket_tournaments");
    if (savedTournaments) {
      try {
        const parsed = JSON.parse(savedTournaments);
        MOCK_TOURNAMENTS = parsed;
        
        // If user is logged in, filter tournaments by creator
        if (currentUser) {
          setTournaments(parsed.filter((t: Tournament) => t.createdBy === currentUser.id));
        } else {
          setTournaments([]);
        }
      } catch (e) {
        console.error("Failed to parse saved tournaments");
      }
    }
    setIsLoading(false);
  }, [currentUser]);

  // Helper to save tournaments to localStorage
  const saveTournaments = (tournaments: Tournament[]) => {
    MOCK_TOURNAMENTS = tournaments;
    localStorage.setItem("cricket_tournaments", JSON.stringify(tournaments));
  };

  // Generate a unique secret code
  const generateSecretCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create a new tournament
  const createTournament = async (tournament: Partial<Tournament>): Promise<Tournament> => {
    if (!currentUser) throw new Error("You must be logged in to create a tournament");
    
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTournament: Tournament = {
      id: Date.now().toString(),
      name: tournament.name || "New Tournament",
      format: tournament.format || TournamentFormat.KNOCKOUT,
      createdBy: currentUser.id,
      secretCode: generateSecretCode(),
      teams: [],
      matches: [],
      ...tournament
    };
    
    const updatedTournaments = [...MOCK_TOURNAMENTS, newTournament];
    saveTournaments(updatedTournaments);
    
    setTournaments(prev => [...prev, newTournament]);
    setCurrentTournament(newTournament);
    setIsLoading(false);
    
    toast({
      title: "Success",
      description: "Tournament created successfully",
    });
    
    return newTournament;
  };

  // Update an existing tournament
  const updateTournament = async (id: string, tournamentUpdate: Partial<Tournament>): Promise<Tournament> => {
    if (!currentUser) throw new Error("You must be logged in to update a tournament");
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedTournaments = MOCK_TOURNAMENTS.map(t => 
      t.id === id ? { ...t, ...tournamentUpdate } : t
    );
    
    const updatedTournament = updatedTournaments.find(t => t.id === id);
    if (!updatedTournament) {
      setIsLoading(false);
      throw new Error("Tournament not found");
    }
    
    // Check if the user has permission
    if (updatedTournament.createdBy !== currentUser.id) {
      setIsLoading(false);
      throw new Error("You don't have permission to update this tournament");
    }
    
    saveTournaments(updatedTournaments);
    
    setTournaments(prev => prev.map(t => 
      t.id === id ? { ...t, ...tournamentUpdate } : t
    ));
    
    if (currentTournament?.id === id) {
      setCurrentTournament({ ...currentTournament, ...tournamentUpdate });
    }
    
    setIsLoading(false);
    toast({
      title: "Success",
      description: "Tournament updated successfully",
    });
    
    return updatedTournament;
  };

  // Delete a tournament
  const deleteTournament = async (id: string): Promise<void> => {
    if (!currentUser) throw new Error("You must be logged in to delete a tournament");
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tournament = MOCK_TOURNAMENTS.find(t => t.id === id);
    if (!tournament) {
      setIsLoading(false);
      throw new Error("Tournament not found");
    }
    
    // Check if the user has permission
    if (tournament.createdBy !== currentUser.id) {
      setIsLoading(false);
      throw new Error("You don't have permission to delete this tournament");
    }
    
    const updatedTournaments = MOCK_TOURNAMENTS.filter(t => t.id !== id);
    saveTournaments(updatedTournaments);
    
    setTournaments(prev => prev.filter(t => t.id !== id));
    
    if (currentTournament?.id === id) {
      setCurrentTournament(null);
    }
    
    setIsLoading(false);
    toast({
      title: "Success",
      description: "Tournament deleted successfully",
    });
  };

  // Get a tournament by its secret code
  const getTournamentByCode = async (code: string): Promise<Tournament | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tournament = MOCK_TOURNAMENTS.find(t => 
      t.secretCode.toLowerCase() === code.toLowerCase()
    );
    
    setIsLoading(false);
    
    if (tournament) {
      setCurrentTournament(tournament);
      return tournament;
    }
    
    toast({
      title: "Error",
      description: "Tournament not found. Check the code and try again.",
      variant: "destructive",
    });
    
    return null;
  };

  // Add a team to a tournament
  const addTeam = async (tournamentId: string, team: Partial<Team>): Promise<Team> => {
    if (!currentUser) throw new Error("You must be logged in to add a team");
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tournamentIndex = MOCK_TOURNAMENTS.findIndex(t => t.id === tournamentId);
    if (tournamentIndex === -1) {
      setIsLoading(false);
      throw new Error("Tournament not found");
    }
    
    const tournament = MOCK_TOURNAMENTS[tournamentIndex];
    
    // Check if the user has permission
    if (tournament.createdBy !== currentUser.id) {
      setIsLoading(false);
      throw new Error("You don't have permission to update this tournament");
    }
    
    const newTeam: Team = {
      id: Date.now().toString(),
      name: team.name || "New Team",
      players: team.players || [],
      tournamentId,
      ...team
    };
    
    const updatedTournament = { 
      ...tournament, 
      teams: [...tournament.teams, newTeam] 
    };
    
    const updatedTournaments = [...MOCK_TOURNAMENTS];
    updatedTournaments[tournamentIndex] = updatedTournament;
    saveTournaments(updatedTournaments);
    
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId ? updatedTournament : t
    ));
    
    if (currentTournament?.id === tournamentId) {
      setCurrentTournament(updatedTournament);
    }
    
    setIsLoading(false);
    toast({
      title: "Success",
      description: "Team added successfully",
    });
    
    return newTeam;
  };

  // Update a team
  const updateTeam = async (tournamentId: string, teamId: string, teamUpdate: Partial<Team>): Promise<Team> => {
    if (!currentUser) throw new Error("You must be logged in to update a team");
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tournamentIndex = MOCK_TOURNAMENTS.findIndex(t => t.id === tournamentId);
    if (tournamentIndex === -1) {
      setIsLoading(false);
      throw new Error("Tournament not found");
    }
    
    const tournament = MOCK_TOURNAMENTS[tournamentIndex];
    
    // Check if the user has permission
    if (tournament.createdBy !== currentUser.id) {
      setIsLoading(false);
      throw new Error("You don't have permission to update this tournament");
    }
    
    const teamIndex = tournament.teams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) {
      setIsLoading(false);
      throw new Error("Team not found");
    }
    
    const updatedTeam = { 
      ...tournament.teams[teamIndex], 
      ...teamUpdate 
    };
    
    const updatedTeams = [...tournament.teams];
    updatedTeams[teamIndex] = updatedTeam;
    
    const updatedTournament = { 
      ...tournament, 
      teams: updatedTeams 
    };
    
    const updatedTournaments = [...MOCK_TOURNAMENTS];
    updatedTournaments[tournamentIndex] = updatedTournament;
    saveTournaments(updatedTournaments);
    
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId ? updatedTournament : t
    ));
    
    if (currentTournament?.id === tournamentId) {
      setCurrentTournament(updatedTournament);
    }
    
    setIsLoading(false);
    toast({
      title: "Success",
      description: "Team updated successfully",
    });
    
    return updatedTeam;
  };

  // Delete a team
  const deleteTeam = async (tournamentId: string, teamId: string): Promise<void> => {
    if (!currentUser) throw new Error("You must be logged in to delete a team");
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tournamentIndex = MOCK_TOURNAMENTS.findIndex(t => t.id === tournamentId);
    if (tournamentIndex === -1) {
      setIsLoading(false);
      throw new Error("Tournament not found");
    }
    
    const tournament = MOCK_TOURNAMENTS[tournamentIndex];
    
    // Check if the user has permission
    if (tournament.createdBy !== currentUser.id) {
      setIsLoading(false);
      throw new Error("You don't have permission to update this tournament");
    }
    
    const updatedTeams = tournament.teams.filter(t => t.id !== teamId);
    
    // Also remove matches involving this team
    const updatedMatches = tournament.matches.filter(
      m => m.team1Id !== teamId && m.team2Id !== teamId
    );
    
    const updatedTournament = { 
      ...tournament, 
      teams: updatedTeams,
      matches: updatedMatches
    };
    
    const updatedTournaments = [...MOCK_TOURNAMENTS];
    updatedTournaments[tournamentIndex] = updatedTournament;
    saveTournaments(updatedTournaments);
    
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId ? updatedTournament : t
    ));
    
    if (currentTournament?.id === tournamentId) {
      setCurrentTournament(updatedTournament);
    }
    
    setIsLoading(false);
    toast({
      title: "Success",
      description: "Team deleted successfully",
    });
  };

  // Create a new match
  const createMatch = async (tournamentId: string, match: Partial<Match>): Promise<Match> => {
    if (!currentUser) throw new Error("You must be logged in to create a match");
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tournamentIndex = MOCK_TOURNAMENTS.findIndex(t => t.id === tournamentId);
    if (tournamentIndex === -1) {
      setIsLoading(false);
      throw new Error("Tournament not found");
    }
    
    const tournament = MOCK_TOURNAMENTS[tournamentIndex];
    
    // Check if the user has permission
    if (tournament.createdBy !== currentUser.id) {
      setIsLoading(false);
      throw new Error("You don't have permission to update this tournament");
    }
    
    const newMatch: Match = {
      id: Date.now().toString(),
      tournamentId,
      team1Id: match.team1Id || "",
      team2Id: match.team2Id || "",
      status: MatchStatus.UPCOMING,
      ...match
    };
    
    const updatedTournament = { 
      ...tournament, 
      matches: [...tournament.matches, newMatch] 
    };
    
    const updatedTournaments = [...MOCK_TOURNAMENTS];
    updatedTournaments[tournamentIndex] = updatedTournament;
    saveTournaments(updatedTournaments);
    
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId ? updatedTournament : t
    ));
    
    if (currentTournament?.id === tournamentId) {
      setCurrentTournament(updatedTournament);
    }
    
    setIsLoading(false);
    toast({
      title: "Success",
      description: "Match created successfully",
    });
    
    return newMatch;
  };

  // Update a match
  const updateMatch = async (tournamentId: string, matchId: string, matchUpdate: Partial<Match>): Promise<Match> => {
    if (!currentUser) throw new Error("You must be logged in to update a match");
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tournamentIndex = MOCK_TOURNAMENTS.findIndex(t => t.id === tournamentId);
    if (tournamentIndex === -1) {
      setIsLoading(false);
      throw new Error("Tournament not found");
    }
    
    const tournament = MOCK_TOURNAMENTS[tournamentIndex];
    
    // Check if the user has permission
    if (tournament.createdBy !== currentUser.id) {
      setIsLoading(false);
      throw new Error("You don't have permission to update this tournament");
    }
    
    const matchIndex = tournament.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      setIsLoading(false);
      throw new Error("Match not found");
    }
    
    const updatedMatch = { 
      ...tournament.matches[matchIndex], 
      ...matchUpdate 
    };
    
    const updatedMatches = [...tournament.matches];
    updatedMatches[matchIndex] = updatedMatch;
    
    const updatedTournament = { 
      ...tournament, 
      matches: updatedMatches 
    };
    
    const updatedTournaments = [...MOCK_TOURNAMENTS];
    updatedTournaments[tournamentIndex] = updatedTournament;
    saveTournaments(updatedTournaments);
    
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId ? updatedTournament : t
    ));
    
    if (currentTournament?.id === tournamentId) {
      setCurrentTournament(updatedTournament);
    }
    
    setIsLoading(false);
    toast({
      title: "Success",
      description: "Match updated successfully",
    });
    
    return updatedMatch;
  };

  // Generate random matches for a tournament
  const generateRandomMatches = async (tournamentId: string): Promise<Match[]> => {
    if (!currentUser) throw new Error("You must be logged in to generate matches");
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tournamentIndex = MOCK_TOURNAMENTS.findIndex(t => t.id === tournamentId);
    if (tournamentIndex === -1) {
      setIsLoading(false);
      throw new Error("Tournament not found");
    }
    
    const tournament = MOCK_TOURNAMENTS[tournamentIndex];
    
    // Check if the user has permission
    if (tournament.createdBy !== currentUser.id) {
      setIsLoading(false);
      throw new Error("You don't have permission to update this tournament");
    }
    
    const { teams, format } = tournament;
    if (teams.length < 2) {
      setIsLoading(false);
      throw new Error("At least 2 teams are required to generate matches");
    }
    
    let newMatches: Match[] = [];
    
    // Different match generation based on format
    if (format === TournamentFormat.LEAGUE) {
      // League format - each team plays against all other teams
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          const match: Match = {
            id: `${Date.now()}-${i}-${j}`,
            tournamentId,
            team1Id: teams[i].id,
            team2Id: teams[j].id,
            status: MatchStatus.UPCOMING,
            date: new Date(Date.now() + (i * j * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Simple date generation
          };
          newMatches.push(match);
        }
      }
    } else if (format === TournamentFormat.KNOCKOUT) {
      // Knockout format - generate first round matches
      for (let i = 0; i < Math.floor(teams.length / 2); i++) {
        const match: Match = {
          id: `${Date.now()}-${i}`,
          tournamentId,
          team1Id: teams[i * 2].id,
          team2Id: teams[i * 2 + 1]?.id || "", // Handle odd number of teams
          status: MatchStatus.UPCOMING,
          date: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        };
        newMatches.push(match);
      }
    } else if (format === TournamentFormat.GROUP_KNOCKOUT) {
      // For simplicity, just create two groups and then matches within groups
      const midpoint = Math.ceil(teams.length / 2);
      const group1 = teams.slice(0, midpoint);
      const group2 = teams.slice(midpoint);
      
      // Group 1 matches
      for (let i = 0; i < group1.length; i++) {
        for (let j = i + 1; j < group1.length; j++) {
          const match: Match = {
            id: `${Date.now()}-g1-${i}-${j}`,
            tournamentId,
            team1Id: group1[i].id,
            team2Id: group1[j].id,
            status: MatchStatus.UPCOMING,
            date: new Date(Date.now() + (i * j * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          };
          newMatches.push(match);
        }
      }
      
      // Group 2 matches
      for (let i = 0; i < group2.length; i++) {
        for (let j = i + 1; j < group2.length; j++) {
          const match: Match = {
            id: `${Date.now()}-g2-${i}-${j}`,
            tournamentId,
            team1Id: group2[i].id,
            team2Id: group2[j].id,
            status: MatchStatus.UPCOMING,
            date: new Date(Date.now() + (i * j * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          };
          newMatches.push(match);
        }
      }
    }
    
    // Add new matches to tournament
    const updatedTournament = { 
      ...tournament, 
      matches: [...tournament.matches, ...newMatches] 
    };
    
    const updatedTournaments = [...MOCK_TOURNAMENTS];
    updatedTournaments[tournamentIndex] = updatedTournament;
    saveTournaments(updatedTournaments);
    
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId ? updatedTournament : t
    ));
    
    if (currentTournament?.id === tournamentId) {
      setCurrentTournament(updatedTournament);
    }
    
    setIsLoading(false);
    toast({
      title: "Success",
      description: `${newMatches.length} matches generated successfully`,
    });
    
    return newMatches;
  };

  return (
    <TournamentContext.Provider value={{
      tournaments,
      currentTournament,
      isLoading,
      createTournament,
      updateTournament,
      deleteTournament,
      getTournamentByCode,
      setCurrentTournament,
      addTeam,
      updateTeam,
      deleteTeam,
      createMatch,
      updateMatch,
      generateRandomMatches
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
};
