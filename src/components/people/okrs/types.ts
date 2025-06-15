
export interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
}

export interface OKR {
  id: string;
  title: string;
  description: string;
  objective: string;
  key_results: KeyResult[];
  quarter: string;
  progress_percentage: number;
  status: string;
  team_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
