export interface UserProfile {
  email: string;
  created_at: string;
  level: number;
  current_xp: number;
  xp_to_next_level: number;
}

export interface AcquiredSkill {
  id: string;
  name: string;
  icon_name: string;
  xp_points: number;
}
