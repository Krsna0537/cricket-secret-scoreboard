
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tournament, TournamentFormat, Team, Match, MatchStatus } from "@/types";
import { DbTournament, TournamentFormatDb, MatchStatusDb } from "@/types/supabase-types";

export const useTournamentService = () => {
  const [isLoading, setIsLoading] = useState(false);

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
      
      return transformedTournaments;
    } catch (error: any) {
      toast.error(`Error fetching tournaments: ${error.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createTournament = async (tournamentData: Partial<Tournament>, userId: string) => {
    try {
      setIsLoading(true);
      
      if (!userId) {
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
        created_by: userId
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
      const tournament = transformFullTournament(data);
      
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
      const tournament = transformFullTournament(data);
      
      return tournament;
    } catch (error: any) {
      toast.error(`Error retrieving tournament: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to transform tournament data
  const transformFullTournament = (data: any): Tournament => {
    return {
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
  };
  
  return {
    isLoading,
    fetchTournaments,
    createTournament,
    updateTournament,
    deleteTournament,
    getTournamentByCode,
    getTournament,
  };
};
