export type UserRole = "lexi" | "viewer";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
}

export interface MeterReading {
  id: number;
  value: number;
  updated_at: Date;
  note: string | null;
}

export type BountyStatus = "open" | "pending_verification" | "completed";

export interface Bounty {
  id: number;
  title: string;
  description: string;
  point_value: number;
  status: BountyStatus;
  created_at: Date;
  completed_at: Date | null;
}

export interface MeterUpdateRequest {
  value: number;
  note?: string;
}

export interface BountyCreateRequest {
  title: string;
  description: string;
  point_value: number;
}

export interface BountyUpdateRequest {
  status?: BountyStatus;
}
