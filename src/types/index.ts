// Domain Types for Sport Organizer

export type TournamentStatus =
  | "draft"
  | "published"
  | "registration_closed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type RegistrationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "withdrawn";

export type MatchStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "postponed"
  | "cancelled";

export type UserRole =
  | "guest"
  | "player"
  | "captain"
  | "organizer"
  | "organization_admin"
  | "platform_admin";

export interface Tournament {
  id: string;
  name: string;
  sport_id: string;
  description: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  venue: string;
  status: TournamentStatus;
  max_teams: number;
  min_roster_size: number;
  max_roster_size: number;
  organizer_id: string;
  organization_id?: string;
  banner_image_url?: string;
  rules?: string;
  prize_info?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  sport_id: string;
  college?: string;
  captain_id: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "captain" | "player";
  joined_at: string;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  team_id: string;
  status: RegistrationStatus;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
}

export interface Match {
  id: string;
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;
  scheduled_at: string;
  venue: string;
  round?: string;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
}

export interface MatchResult {
  id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  recorded_by: string;
  recorded_at: string;
  is_final: boolean;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  college?: string;
  preferred_sports?: string[];
  created_at: string;
  updated_at: string;
}

export interface Sport {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}
