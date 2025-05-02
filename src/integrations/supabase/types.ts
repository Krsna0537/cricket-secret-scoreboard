export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ball_by_ball: {
        Row: {
          ball_number: number
          batsman_id: string | null
          bowler_id: string | null
          created_at: string | null
          id: string
          innings_id: string
          is_wicket: boolean
          over_number: number
          runs: number
          wicket_type: string | null
        }
        Insert: {
          ball_number: number
          batsman_id?: string | null
          bowler_id?: string | null
          created_at?: string | null
          id?: string
          innings_id: string
          is_wicket?: boolean
          over_number: number
          runs?: number
          wicket_type?: string | null
        }
        Update: {
          ball_number?: number
          batsman_id?: string | null
          bowler_id?: string | null
          created_at?: string | null
          id?: string
          innings_id?: string
          is_wicket?: boolean
          over_number?: number
          runs?: number
          wicket_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ball_by_ball_batsman_id_fkey"
            columns: ["batsman_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ball_by_ball_bowler_id_fkey"
            columns: ["bowler_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ball_by_ball_innings_id_fkey"
            columns: ["innings_id"]
            isOneToOne: false
            referencedRelation: "innings"
            referencedColumns: ["id"]
          },
        ]
      }
      innings: {
        Row: {
          created_at: string | null
          id: string
          is_first_innings: boolean
          match_id: string
          overs: number
          runs: number
          team_id: string
          wickets: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_first_innings: boolean
          match_id: string
          overs?: number
          runs?: number
          team_id: string
          wickets?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_first_innings?: boolean
          match_id?: string
          overs?: number
          runs?: number
          team_id?: string
          wickets?: number
        }
        Relationships: [
          {
            foreignKeyName: "innings_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "innings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          id: string
          match_date: string | null
          match_time: string | null
          status: Database["public"]["Enums"]["match_status"] | null
          team1_id: string
          team2_id: string
          tournament_id: string
          venue: string | null
          win_margin: number | null
          win_margin_type: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_date?: string | null
          match_time?: string | null
          status?: Database["public"]["Enums"]["match_status"] | null
          team1_id: string
          team2_id: string
          tournament_id: string
          venue?: string | null
          win_margin?: number | null
          win_margin_type?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_date?: string | null
          match_time?: string | null
          status?: Database["public"]["Enums"]["match_status"] | null
          team1_id?: string
          team2_id?: string
          tournament_id?: string
          venue?: string | null
          win_margin?: number | null
          win_margin_type?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_team1_id_fkey"
            columns: ["team1_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team2_id_fkey"
            columns: ["team2_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats: {
        Row: {
          batting_avg: number | null
          bowling_avg: number | null
          economy_rate: number | null
          id: string
          matches_played: number | null
          player_id: string
          runs_scored: number | null
          strike_rate: number | null
          tournament_id: string
          updated_at: string | null
          wickets_taken: number | null
        }
        Insert: {
          batting_avg?: number | null
          bowling_avg?: number | null
          economy_rate?: number | null
          id?: string
          matches_played?: number | null
          player_id: string
          runs_scored?: number | null
          strike_rate?: number | null
          tournament_id: string
          updated_at?: string | null
          wickets_taken?: number | null
        }
        Update: {
          batting_avg?: number | null
          bowling_avg?: number | null
          economy_rate?: number | null
          id?: string
          matches_played?: number | null
          player_id?: string
          runs_scored?: number | null
          strike_rate?: number | null
          tournament_id?: string
          updated_at?: string | null
          wickets_taken?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          batting_style: string | null
          bowling_style: string | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          role: string | null
          team_id: string
        }
        Insert: {
          batting_style?: string | null
          bowling_style?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          role?: string | null
          team_id: string
        }
        Update: {
          batting_style?: string | null
          bowling_style?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      team_stats: {
        Row: {
          id: string
          matches_drawn: number | null
          matches_lost: number | null
          matches_no_result: number | null
          matches_played: number | null
          matches_won: number | null
          net_run_rate: number | null
          points: number | null
          team_id: string
          tournament_id: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          matches_drawn?: number | null
          matches_lost?: number | null
          matches_no_result?: number | null
          matches_played?: number | null
          matches_won?: number | null
          net_run_rate?: number | null
          points?: number | null
          team_id: string
          tournament_id: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          matches_drawn?: number | null
          matches_lost?: number | null
          matches_no_result?: number | null
          matches_played?: number | null
          matches_won?: number | null
          net_run_rate?: number | null
          points?: number | null
          team_id?: string
          tournament_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_stats_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          short_name: string | null
          tournament_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          short_name?: string | null
          tournament_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          short_name?: string | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          format: Database["public"]["Enums"]["tournament_format"]
          id: string
          location: string | null
          logo_url: string | null
          name: string
          secret_code: string
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          format: Database["public"]["Enums"]["tournament_format"]
          id?: string
          location?: string | null
          logo_url?: string | null
          name: string
          secret_code: string
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          format?: Database["public"]["Enums"]["tournament_format"]
          id?: string
          location?: string | null
          logo_url?: string | null
          name?: string
          secret_code?: string
          start_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      match_status: "upcoming" | "live" | "completed" | "abandoned"
      tournament_format: "knockout" | "league" | "group_knockout"
      user_role: "admin" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      match_status: ["upcoming", "live", "completed", "abandoned"],
      tournament_format: ["knockout", "league", "group_knockout"],
      user_role: ["admin", "viewer"],
    },
  },
} as const
