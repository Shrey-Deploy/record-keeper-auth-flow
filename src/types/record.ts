
export interface Record {
  id: string;
  property_address: string;
  transaction_date: string;
  borrower_name: string;
  loan_officer_name?: string;
  nmls_id?: string;
  loan_amount: number;
  sales_price: number;
  down_payment: number;
  loan_term?: number;
  apn: string;
  status: 'Pending' | 'Verified' | 'Flagged';
  locked_by?: string;
  lock_timestamp?: string;
  entered_by: string;
  entered_by_date: string;
  reviewed_by?: string;
  reviewed_by_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRecordData {
  property_address: string;
  transaction_date: string;
  borrower_name: string;
  loan_officer_name?: string;
  nmls_id?: string;
  loan_amount: number;
  sales_price: number;
  down_payment: number;
  loan_term?: number;
  apn: string;
  status?: 'Pending' | 'Verified' | 'Flagged';
}
