export interface Profile {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export interface Earning {
  id: string;
  user_id: string;
  month: string;
  amount_vnd: number;
  status: 'planned' | 'actual';
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  fund_id: string | null;
  month: string;
  amount_vnd: number;
  status: 'planned' | 'actual';
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Fund {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface FundMember {
  fund_id: string;
  user_id: string;
  display_name: string;
  email: string;
  added_at: string;
}

export interface MonthlySummary {
  month: string;
  plannedEarnings: number;
  actualEarnings: number;
  plannedExpenses: number;
  actualExpenses: number;
  plannedNet: number;
  actualNet: number;
}
