
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Team, Player } from "@/types";

export const useTeamService = () => {
  const [isLoading, setIsLoading] = useState(false);

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
      
      toast.success("Team deleted successfully!");
      return true;
    } catch (error: any) {
      toast.error(`Error deleting team: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createTeam,
    updateTeam,
    deleteTeam,
  };
};
