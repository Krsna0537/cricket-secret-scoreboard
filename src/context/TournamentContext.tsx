
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tournament, Team, Match, Player, TournamentFormat, MatchStatus } from "@/types";
import { DbTournament, TournamentFormatDb, MatchStatusDb } from "@/types/supabase-types";
import { useAuth } from "./AuthContext";

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
  // Adding properties to match component usage
  setCurrentTournament: (tournament: Tournament) => void;
}

const TournamentContext = createContext<TournamentContextProps | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      
      const { data: tournamentsData, error } = await supabase
        .from('tournaments')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      const transformedTournaments: Tournament[] = tournamentsData.map((t: DbTournament) => ({
        id: t.id,
        name: t.name,
        format: t.format as TournamentFormat,
        description: t.description || '',
        location: t.location || '',
        logo: t.logo_url || '',
        startDate: t.start_date || '',
        endDate: t.end_date || '',
        secretCode: t.secret_code,
        createdBy: t.created_by,
        teams: [],
        matches: []
      }));
      
      setTournaments(transformedTournaments);
      return;
    } catch (error: any) {
      toast.error(`Error fetching tournaments: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTournament = async (tournamentData: Partial<Tournament>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error("You must be logged in to create a tournament");
        return null;
      }
      
      // Generate a random secret code if not provided
      const secretCode = tournamentData.secretCode || 
        Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Map to DB schema
      const dbTournament = {
        name: tournamentData.name,
        format: tournamentData.format as TournamentFormatDb,
        description: tournamentData.description,
        location: tournamentData.location,
        logo_url: tournamentData.logo,
        start_date: tournamentData.startDate,
        end_date: tournamentData.endDate,
        secret_code: secretCode,
        created_by: user.id
      };
      
      const { data, error } = await supabase
        .from('tournaments')
        .insert(dbTournament)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Transform the returned data to match our app's Tournament type
      const newTournament: Tournament = {
        id: data.id,
        name: data.name,
        format: data.format as TournamentFormat,
        description: data.description || '',
        location: data.location || '',
        logo: data.logo_url || '',
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        secretCode: data.secret_code,
        createdBy: data.created_by,
        teams: [],
        matches: []
      };
      
      // Add to local state
      setTournaments([...tournaments, newTournament]);
      
      toast.success("Tournament created successfully!");
      return newTournament;
    } catch (error: any) {
      toast.error(`Error creating tournament: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTournament = async (id: string, tournamentData: Partial<Tournament>) => {
    try {
      setIsLoading(true);
      
      // Map to DB schema
      const dbTournament = {
        name: tournamentData.name,
        format: tournamentData.format as TournamentFormatDb,
        description: tournamentData.description,
        location: tournamentData.location,
        logo_url: tournamentData.logo,
        start_date: tournamentData.startDate,
        end_date: tournamentData.endDate
      };
      
      const { data, error } = await supabase
        .from('tournaments')
        .update(dbTournament)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Transform the returned data
      const updatedTournament: Tournament = {
        id: data.id,
        name: data.name,
        format: data.format as TournamentFormat,
        description: data.description || '',
        location: data.location || '',
        logo: data.logo_url || '',
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        secretCode: data.secret_code,
        createdBy: data.created_by,
        teams: [],
        matches: []
      };
      
      // Update local state
      setTournaments(
        tournaments.map(t => (t.id === id ? updatedTournament : t))
      );
      
      if (currentTournament?.id === id) {
        setCurrentTournament({
          ...currentTournament,
          ...updatedTournament
        });
      }
      
      toast.success("Tournament updated successfully!");
      return updatedTournament;
    } catch (error: any) {
      toast.error(`Error updating tournament: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTournament = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTournaments(tournaments.filter(t => t.id !== id));
      
      if (currentTournament?.id === id) {
        setCurrentTournament(null);
      }
      
      toast.success("Tournament deleted successfully!");
      return true;
    } catch (error: any) {
      toast.error(`Error deleting tournament: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getTournamentByCode = async (code: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          teams:teams(
            *,
            players:players(*)
          ),
          matches:matches(*)
        `)
        .eq('secret_code', code)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        toast.error("Tournament not found");
        return null;
      }
      
      // Transform the tournament data
      const tournament: Tournament = {
        id: data.id,
        name: data.name,
        format: data.format as TournamentFormat,
        description: data.description || '',
        location: data.location || '',
        logo: data.logo_url || '',
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        secretCode: data.secret_code,
        createdBy: data.created_by,
        teams: data.teams.map((team: any) => ({
          id: team.id,
          name: team.name,
          shortName: team.short_name || '',
          logo: team.logo_url || '',
          tournamentId: team.tournament_id,
          players: team.players.map((player: any) => ({
            id: player.id,
            name: player.name,
            role: player.role || '',
            batting: player.batting_style || '',
            bowling: player.bowling_style || '',
            image: player.image_url || ''
          }))
        })),
        matches: data.matches.map((match: any) => ({
          id: match.id,
          tournamentId: match.tournament_id,
          team1Id: match.team1_id,
          team2Id: match.team2_id,
          date: match.match_date || '',
          time: match.match_time || '',
          venue: match.venue || '',
          status: match.status as MatchStatus,
          winner: match.winner_id || '',
          result: match.winner_id ? {
            winnerId: match.winner_id,
            winMargin: match.win_margin,
            winMarginType: (match.win_margin_type as "runs" | "wickets") || "runs"
          } : undefined
        }))
      };
      
      setCurrentTournament(tournament);
      
      toast.success(`Accessed tournament: ${tournament.name}`);
      return tournament;
    } catch (error: any) {
      toast.error(`Error retrieving tournament: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTournament = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          teams:teams(
            *,
            players:players(*)
          ),
          matches:matches(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        toast.error("Tournament not found");
        return null;
      }
      
      // Transform the tournament data
      const tournament: Tournament = {
        id: data.id,
        name: data.name,
        format: data.format as TournamentFormat,
        description: data.description || '',
        location: data.location || '',
        logo: data.logo_url || '',
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        secretCode: data.secret_code,
        createdBy: data.created_by,
        teams: data.teams.map((team: any) => ({
          id: team.id,
          name: team.name,
          shortName: team.short_name || '',
          logo: team.logo_url || '',
          tournamentId: team.tournament_id,
          players: team.players.map((player: any) => ({
            id: player.id,
            name: player.name,
            role: player.role || '',
            batting: player.batting_style || '',
            bowling: player.bowling_style || '',
            image: player.image_url || ''
          }))
        })),
        matches: data.matches.map((match: any) => ({
          id: match.id,
          tournamentId: match.tournament_id,
          team1Id: match.team1_id,
          team2Id: match.team2_id,
          date: match.match_date || '',
          time: match.match_time || '',
          venue: match.venue || '',
          status: match.status as MatchStatus,
          winner: match.winner_id || '',
          result: match.winner_id ? {
            winnerId: match.winner_id,
            winMargin: match.win_margin,
            winMarginType: (match.win_margin_type as "runs" | "wickets") || "runs"
          } : undefined
        }))
      };
      
      setCurrentTournament(tournament);
      
      return tournament;
    } catch (error: any) {
      toast.error(`Error retrieving tournament: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (teamData: Partial<Team>) => {
    try {
      setIsLoading(true);
      
      // Map to DB schema
      const dbTeam = {
        tournament_id: teamData.tournamentId,
        name: teamData.name,
        short_name: teamData.shortName,
        logo_url: teamData.logo,
      };
      
      const { data, error } = await supabase
        .from('teams')
        .insert(dbTeam)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add players if provided
      if (teamData.players && teamData.players.length > 0) {
        const playersToInsert = teamData.players.map(player => ({
          team_id: data.id,
          name: player.name,
          role: player.role,
          batting_style: player.batting,
          bowling_style: player.bowling,
          image_url: player.image
        }));
        
        const { error: playersError } = await supabase
          .from('players')
          .insert(playersToInsert);
        
        if (playersError) {
          console.error('Error adding players:', playersError);
          // Continue with team creation even if player addition fails
        }
      }
      
      // Transform the returned data
      const newTeam: Team = {
        id: data.id,
        name: data.name,
        shortName: data.short_name || '',
        logo: data.logo_url || '',
        tournamentId: data.tournament_id,
        players: teamData.players || []
      };
      
      // Update local state
      if (currentTournament) {
        const updatedTournament = {
          ...currentTournament,
          teams: [...(currentTournament.teams || []), newTeam]
        };
        setCurrentTournament(updatedTournament);
      }
      
      toast.success("Team created successfully!");
      return newTeam;
    } catch (error: any) {
      toast.error(`Error creating team: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeam = async (id: string, teamData: Partial<Team>) => {
    try {
      setIsLoading(true);
      
      // Map to DB schema
      const dbTeam = {
        name: teamData.name,
        short_name: teamData.shortName,
        logo_url: teamData.logo
      };
      
      const { data, error } = await supabase
        .from('teams')
        .update(dbTeam)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Handle players update if provided
      if (teamData.players) {
        // Delete existing players
        await supabase
          .from('players')
          .delete()
          .eq('team_id', id);
        
        // Insert new players
        if (teamData.players.length > 0) {
          const playersToInsert = teamData.players.map(player => ({
            team_id: id,
            name: player.name,
            role: player.role,
            batting_style: player.batting,
            bowling_style: player.bowling,
            image_url: player.image
          }));
          
          const { error: playersError } = await supabase
            .from('players')
            .insert(playersToInsert);
          
          if (playersError) {
            console.error('Error updating players:', playersError);
          }
        }
      }
      
      // Transform the returned data
      const updatedTeam: Team = {
        id: data.id,
        name: data.name,
        shortName: data.short_name || '',
        logo: data.logo_url || '',
        tournamentId: data.tournament_id,
        players: teamData.players || []
      };
      
      // Update local state
      if (currentTournament) {
        const updatedTournament = {
          ...currentTournament,
          teams: currentTournament.teams?.map(team => 
            team.id === id ? updatedTeam : team
          ) || []
        };
        setCurrentTournament(updatedTournament);
      }
      
      toast.success("Team updated successfully!");
      return updatedTeam;
    } catch (error: any) {
      toast.error(`Error updating team: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      if (currentTournament) {
        const updatedTournament = {
          ...currentTournament,
          teams: currentTournament.teams?.filter(team => team.id !== id) || []
        };
        setCurrentTournament(updatedTournament);
      }
      
      toast.success("Team deleted successfully!");
      return true;
    } catch (error: any) {
      toast.error(`Error deleting team: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createMatch = async (matchData: Partial<Match>) => {
    try {
      setIsLoading(true);
      
      // Map to DB schema
      const dbMatch = {
        tournament_id: matchData.tournamentId,
        team1_id: matchData.team1Id,
        team2_id: matchData.team2Id,
        venue: matchData.venue,
        match_date: matchData.date,
        match_time: matchData.time,
        status: matchData.status as MatchStatusDb
      };
      
      const { data, error } = await supabase
        .from('matches')
        .insert(dbMatch)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Transform the returned data
      const newMatch: Match = {
        id: data.id,
        tournamentId: data.tournament_id,
        team1Id: data.team1_id,
        team2Id: data.team2_id,
        venue: data.venue || '',
        date: data.match_date || '',
        time: data.match_time || '',
        status: data.status as MatchStatus
      };
      
      // Update local state
      if (currentTournament) {
        const updatedTournament = {
          ...currentTournament,
          matches: [...(currentTournament.matches || []), newMatch]
        };
        setCurrentTournament(updatedTournament);
      }
      
      toast.success("Match created successfully!");
      return newMatch;
    } catch (error: any) {
      toast.error(`Error creating match: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMatch = async (id: string, matchData: Partial<Match>) => {
    try {
      setIsLoading(true);
      
      // Prepare innings data if it exists
      let inning1Update = null;
      let inning2Update = null;
      
      if (matchData.inning1) {
        inning1Update = {
          match_id: id,
          team_id: matchData.inning1.teamId,
          is_first_innings: true,
          runs: matchData.inning1.runs,
          wickets: matchData.inning1.wickets,
          overs: matchData.inning1.overs
        };
      }
      
      if (matchData.inning2) {
        inning2Update = {
          match_id: id,
          team_id: matchData.inning2.teamId,
          is_first_innings: false,
          runs: matchData.inning2.runs,
          wickets: matchData.inning2.wickets,
          overs: matchData.inning2.overs
        };
      }
      
      // Map to DB schema
      const dbMatch: any = {
        venue: matchData.venue,
        match_date: matchData.date,
        match_time: matchData.time,
        status: matchData.status as MatchStatusDb
      };
      
      // Add winner info if available
      if (matchData.winner) {
        dbMatch.winner_id = matchData.winner;
      }
      
      if (matchData.result) {
        dbMatch.win_margin = matchData.result.winMargin;
        dbMatch.win_margin_type = matchData.result.winMarginType;
      }
      
      // Update match
      const { data, error } = await supabase
        .from('matches')
        .update(dbMatch)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update or create innings if provided
      if (inning1Update) {
        // Check if innings already exists
        const { data: existingInnings } = await supabase
          .from('innings')
          .select()
          .eq('match_id', id)
          .eq('is_first_innings', true)
          .maybeSingle();
        
        if (existingInnings) {
          // Update existing innings
          await supabase
            .from('innings')
            .update({
              runs: inning1Update.runs,
              wickets: inning1Update.wickets,
              overs: inning1Update.overs
            })
            .eq('id', existingInnings.id);
        } else {
          // Create new innings
          await supabase.from('innings').insert(inning1Update);
        }
      }
      
      if (inning2Update) {
        // Check if innings already exists
        const { data: existingInnings } = await supabase
          .from('innings')
          .select()
          .eq('match_id', id)
          .eq('is_first_innings', false)
          .maybeSingle();
        
        if (existingInnings) {
          // Update existing innings
          await supabase
            .from('innings')
            .update({
              runs: inning2Update.runs,
              wickets: inning2Update.wickets,
              overs: inning2Update.overs
            })
            .eq('id', existingInnings.id);
        } else {
          // Create new innings
          await supabase.from('innings').insert(inning2Update);
        }
      }
      
      // Get updated match with innings
      const { data: updatedMatchData } = await supabase
        .from('matches')
        .select(`
          *,
          innings:innings(*)
        `)
        .eq('id', id)
        .single();
      
      // Transform the returned data
      const updatedMatch: Match = {
        id: updatedMatchData.id,
        tournamentId: updatedMatchData.tournament_id,
        team1Id: updatedMatchData.team1_id,
        team2Id: updatedMatchData.team2_id,
        venue: updatedMatchData.venue || '',
        date: updatedMatchData.match_date || '',
        time: updatedMatchData.match_time || '',
        status: updatedMatchData.status as MatchStatus,
        winner: updatedMatchData.winner_id || '',
        result: updatedMatchData.winner_id ? {
          winnerId: updatedMatchData.winner_id,
          winMargin: updatedMatchData.win_margin,
          winMarginType: (updatedMatchData.win_margin_type as "runs" | "wickets") || "runs",
          summary: matchData.result?.summary
        } : undefined
      };
      
      // Add innings data if available
      if (updatedMatchData.innings && updatedMatchData.innings.length > 0) {
        for (const inning of updatedMatchData.innings) {
          if (inning.is_first_innings) {
            updatedMatch.inning1 = {
              teamId: inning.team_id,
              runs: inning.runs,
              wickets: inning.wickets,
              overs: inning.overs
            };
          } else {
            updatedMatch.inning2 = {
              teamId: inning.team_id,
              runs: inning.runs,
              wickets: inning.wickets,
              overs: inning.overs
            };
          }
        }
      }
      
      // Update local state
      if (currentTournament) {
        const updatedTournament = {
          ...currentTournament,
          matches: currentTournament.matches?.map(match => 
            match.id === id ? updatedMatch : match
          ) || []
        };
        setCurrentTournament(updatedTournament);
      }
      
      toast.success("Match updated successfully!");
      return updatedMatch;
    } catch (error: any) {
      toast.error(`Error updating match: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMatch = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      if (currentTournament) {
        const updatedTournament = {
          ...currentTournament,
          matches: currentTournament.matches?.filter(match => match.id !== id) || []
        };
        setCurrentTournament(updatedTournament);
      }
      
      toast.success("Match deleted successfully!");
      return true;
    } catch (error: any) {
      toast.error(`Error deleting match: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
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
        // Adding this to match component usage
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
