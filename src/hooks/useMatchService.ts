
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Match, MatchStatus } from "@/types";
import { MatchStatusDb } from "@/types/supabase-types";

export const useMatchService = () => {
  const [isLoading, setIsLoading] = useState(false);

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
        await handleInningsUpdate(id, true, inning1Update);
      }
      
      if (inning2Update) {
        await handleInningsUpdate(id, false, inning2Update);
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
      const updatedMatch = transformMatchData(updatedMatchData);
      
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
      
      toast.success("Match deleted successfully!");
      return true;
    } catch (error: any) {
      toast.error(`Error deleting match: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to handle innings updates
  const handleInningsUpdate = async (matchId: string, isFirstInnings: boolean, inningData: any) => {
    // Check if innings already exists
    const { data: existingInnings } = await supabase
      .from('innings')
      .select()
      .eq('match_id', matchId)
      .eq('is_first_innings', isFirstInnings)
      .maybeSingle();
    
    if (existingInnings) {
      // Update existing innings
      await supabase
        .from('innings')
        .update({
          runs: inningData.runs,
          wickets: inningData.wickets,
          overs: inningData.overs
        })
        .eq('id', existingInnings.id);
    } else {
      // Create new innings
      await supabase.from('innings').insert(inningData);
    }
  };

  // Helper function to transform match data
  const transformMatchData = (data: any): Match => {
    const match: Match = {
      id: data.id,
      tournamentId: data.tournament_id,
      team1Id: data.team1_id,
      team2Id: data.team2_id,
      venue: data.venue || '',
      date: data.match_date || '',
      time: data.match_time || '',
      status: data.status as MatchStatus,
      winner: data.winner_id || '',
      result: data.winner_id ? {
        winnerId: data.winner_id,
        winMargin: data.win_margin,
        winMarginType: (data.win_margin_type as "runs" | "wickets") || "runs"
      } : undefined
    };
    
    // Add innings data if available
    if (data.innings && data.innings.length > 0) {
      for (const inning of data.innings) {
        if (inning.is_first_innings) {
          match.inning1 = {
            teamId: inning.team_id,
            runs: inning.runs,
            wickets: inning.wickets,
            overs: inning.overs
          };
        } else {
          match.inning2 = {
            teamId: inning.team_id,
            runs: inning.runs,
            wickets: inning.wickets,
            overs: inning.overs
          };
        }
      }
    }
    
    return match;
  };

  return {
    isLoading,
    createMatch,
    updateMatch,
    deleteMatch
  };
};
