export interface Profile {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export interface Earning {
  id: string;
  user_id: string;
  month: string;                            // "YYYY-MM"
  amount_vnd: number;
  status: 'planned' | 'actual';
  name: string;                             // renamed from description
  type: 'regular' | 'receivable';          // NEW
  receiver_type: 'user' | 'fund';          // NEW (user = to themselves)
  receiver_id: string | null;              // NEW (fund id when receiver_type=fund)
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  month: string;
  amount_vnd: number;
  status: 'planned' | 'actual';
  name: string;                             // renamed from description
  sender_type: 'user' | 'fund';           // NEW
  sender_id: string;                        // NEW (user_id or fund_id)
  receiver_type: 'fund' | 'none';         // NEW
  receiver_id: string | null;              // NEW (fund id when receiver_type=fund)
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

// For Income Statement Table
export interface IncomeStatementCell {
  actual: number;
  planned: number;
  actualEntries: (Earning | Expense)[];
  plannedEntries: (Earning | Expense)[];
}

export interface IncomeStatementRow {
  name: string;
  cells: Record<string, IncomeStatementCell>;
}

// For bar chart
export interface ChartMonthData {
  month: string;
  monthLabel: string;
  planned: { earnings: number; receivables: number; expensesExt: number; expensesFund: number };
  actual:  { earnings: number; receivables: number; expensesExt: number; expensesFund: number };
}
