
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tournament, Team, Match } from "@/types";
import { useAuth } from "./AuthContext";
import { useTournamentService } from "@/hooks/useTournamentService";
import { useTeamService } from "@/hooks/useTeamService";
import { useMatchService } from "@/hooks/useMatchService";

interface TournamentContextProps {
  currentTournament: Tournament | null;
  tournaments: Tournament[];
  isLoading: boolean;
  fetchTournaments: () => Promise<void>;
  createTournament: (tournamentData: Partial<Tournament>) => Promise<Tournament | null>;
  updateTournament: (id: string, tournamentData: Partial<Tournament>) => Promise<Tournament | null>;
  deleteTournament: (id: string) => Promise<boolean>;
  getTournamentByCode: (code: string) => Promise<Tournament | null>;
  getTournament: (id: string) => Promise<Tournament | null>;
  createTeam: (teamData: Partial<Team>) => Promise<Team | null>;
  updateTeam: (id: string, teamData: Partial<Team>) => Promise<Team | null>;
  deleteTeam: (id: string) => Promise<boolean>;
  createMatch: (matchData: Partial<Match>) => Promise<Match | null>;
  updateMatch: (id: string, matchData: Partial<Match>) => Promise<Match | null>;
  deleteMatch: (id: string) => Promise<boolean>;
  setCurrentTournament: (tournament: Tournament) => void;
}

const TournamentContext = createContext<TournamentContextProps | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const tournamentService = useTournamentService();
  const teamService = useTeamService();
  const matchService = useMatchService();
  
  // Combined loading state from all services
  const isLoading = tournamentService.isLoading || teamService.isLoading || matchService.isLoading;

  const fetchTournaments = async () => {
    const fetchedTournaments = await tournamentService.fetchTournaments();
    if (fetchedTournaments) {
      setTournaments(fetchedTournaments);
    }
  };

  const createTournament = async (tournamentData: Partial<Tournament>) => {
    if (!user) {
      navigate("/login");
      return null;
    }
    
    const newTournament = await tournamentService.createTournament(tournamentData, user.id);
    if (newTournament) {
      setTournaments([...tournaments, newTournament]);
    }
    return newTournament;
  };

  const updateTournament = async (id: string, tournamentData: Partial<Tournament>) => {
    const updatedTournament = await tournamentService.updateTournament(id, tournamentData);
    if (updatedTournament) {
      setTournaments(tournaments.map(t => (t.id === id ? updatedTournament : t)));
      
      if (currentTournament?.id === id) {
        setCurrentTournament({
          ...currentTournament,
          ...updatedTournament
        });
      }
    }
    return updatedTournament;
  };

  const deleteTournament = async (id: string) => {
    const success = await tournamentService.deleteTournament(id);
    if (success) {
      setTournaments(tournaments.filter(t => t.id !== id));
      
      if (currentTournament?.id === id) {
        setCurrentTournament(null);
      }
    }
    return success;
  };

  const getTournamentByCode = async (code: string) => {
    const tournament = await tournamentService.getTournamentByCode(code);
    if (tournament) {
      setCurrentTournament(tournament);
    }
    return tournament;
  };

  const getTournament = async (id: string) => {
    const tournament = await tournamentService.getTournament(id);
    if (tournament) {
      setCurrentTournament(tournament);
    }
    return tournament;
  };

  const createTeam = async (teamData: Partial<Team>) => {
    const newTeam = await teamService.createTeam(teamData);
    if (newTeam && currentTournament) {
      const updatedTournament = {
        ...currentTournament,
        teams: [...(currentTournament.teams || []), newTeam]
      };
      setCurrentTournament(updatedTournament);
    }
    return newTeam;
  };

  const updateTeam = async (id: string, teamData: Partial<Team>) => {
    const updatedTeam = await teamService.updateTeam(id, teamData);
    if (updatedTeam && currentTournament) {
      const updatedTournament = {
        ...currentTournament,
        teams: currentTournament.teams?.map(team => 
          team.id === id ? updatedTeam : team
        ) || []
      };
      setCurrentTournament(updatedTournament);
    }
    return updatedTeam;
  };

  const deleteTeam = async (id: string) => {
    const success = await teamService.deleteTeam(id);
    if (success && currentTournament) {
      const updatedTournament = {
        ...currentTournament,
        teams: currentTournament.teams?.filter(team => team.id !== id) || []
      };
      setCurrentTournament(updatedTournament);
    }
    return success;
  };

  const createMatch = async (matchData: Partial<Match>) => {
    const newMatch = await matchService.createMatch(matchData);
    if (newMatch && currentTournament) {
      const updatedTournament = {
        ...currentTournament,
        matches: [...(currentTournament.matches || []), newMatch]
      };
      setCurrentTournament(updatedTournament);
    }
    return newMatch;
  };

  const updateMatch = async (id: string, matchData: Partial<Match>) => {
    const updatedMatch = await matchService.updateMatch(id, matchData);
    if (updatedMatch && currentTournament) {
      const updatedTournament = {
        ...currentTournament,
        matches: currentTournament.matches?.map(match => 
          match.id === id ? updatedMatch : match
        ) || []
      };
      setCurrentTournament(updatedTournament);
    }
    return updatedMatch;
  };

  const deleteMatch = async (id: string) => {
    const success = await matchService.deleteMatch(id);
    if (success && currentTournament) {
      const updatedTournament = {
        ...currentTournament,
        matches: currentTournament.matches?.filter(match => match.id !== id) || []
      };
      setCurrentTournament(updatedTournament);
    }
    return success;
  };

  return (
    <TournamentContext.Provider
      value={{
        currentTournament,
        tournaments,
        isLoading,
        fetchTournaments,
        createTournament,
        updateTournament,
        deleteTournament,
        getTournamentByCode,
        getTournament,
        createTeam,
        updateTeam,
        deleteTeam,
        createMatch,
        updateMatch,
        deleteMatch,
        setCurrentTournament
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = (): TournamentContextProps => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
};
