
import type { Database } from '@/integrations/supabase/types';

// Convenient type aliases based on the auto-generated types
export type DbTournament = Database['public']['Tables']['tournaments']['Row'];
export type DbTeam = Database['public']['Tables']['teams']['Row'];
export type DbPlayer = Database['public']['Tables']['players']['Row'];
export type DbMatch = Database['public']['Tables']['matches']['Row'];
export type DbInnings = Database['public']['Tables']['innings']['Row'];
export type DbBallByBall = Database['public']['Tables']['ball_by_ball']['Row'];
export type DbPlayerStats = Database['public']['Tables']['player_stats']['Row'];
export type DbTeamStats = Database['public']['Tables']['team_stats']['Row'];
export type DbProfile = Database['public']['Tables']['profiles']['Row'];

// Enums from the database
export type TournamentFormatDb = Database['public']['Enums']['tournament_format'];
export type MatchStatusDb = Database['public']['Enums']['match_status'];
export type UserRoleDb = Database['public']['Enums']['user_role'];
