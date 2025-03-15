export type NameType = "HOTEL" | "ZONE";
export type HistoryStatus = "pending" | "approved" | "rejected";

export interface NameHistory {
  id: number;
  type: NameType;
  name_before: string;
  name_after: string;
  created_at: Date;
  status: HistoryStatus;
  updated_at: Date;
  target_id: string;
}

export interface NameChangeRequest {
  type: NameType;
  name_before: string;
  name_after: string;
  target_id: string;
}
