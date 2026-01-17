import { sql } from "@vercel/postgres";
import type { User, MeterReading, Bounty, BountyStatus } from "@/types";

// User queries
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql<User>`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result.rows[0] || null;
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await sql<User>`
    SELECT * FROM users WHERE id = ${id}
  `;
  return result.rows[0] || null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  name: string,
  role: "lexi" | "viewer" = "viewer"
): Promise<User> {
  const result = await sql<User>`
    INSERT INTO users (email, password_hash, name, role)
    VALUES (${email}, ${passwordHash}, ${name}, ${role})
    RETURNING *
  `;
  return result.rows[0];
}

// Meter queries
export async function getCurrentMeter(): Promise<MeterReading | null> {
  const result = await sql<MeterReading>`
    SELECT * FROM meter ORDER BY updated_at DESC LIMIT 1
  `;
  return result.rows[0] || null;
}

export async function getMeterHistory(limit: number = 10): Promise<MeterReading[]> {
  const result = await sql<MeterReading>`
    SELECT * FROM meter ORDER BY updated_at DESC LIMIT ${limit}
  `;
  return result.rows;
}

export async function updateMeter(
  value: number,
  note: string | null = null
): Promise<MeterReading> {
  const result = await sql<MeterReading>`
    INSERT INTO meter (value, note, updated_at)
    VALUES (${value}, ${note}, NOW())
    RETURNING *
  `;
  return result.rows[0];
}

// Bounty queries
export async function getAllBounties(): Promise<Bounty[]> {
  const result = await sql<Bounty>`
    SELECT * FROM bounties ORDER BY created_at DESC
  `;
  return result.rows;
}

export async function getOpenBounties(): Promise<Bounty[]> {
  const result = await sql<Bounty>`
    SELECT * FROM bounties WHERE status = 'open' ORDER BY created_at DESC
  `;
  return result.rows;
}

export async function getBountyById(id: number): Promise<Bounty | null> {
  const result = await sql<Bounty>`
    SELECT * FROM bounties WHERE id = ${id}
  `;
  return result.rows[0] || null;
}

export async function createBounty(
  title: string,
  description: string,
  pointValue: number
): Promise<Bounty> {
  const result = await sql<Bounty>`
    INSERT INTO bounties (title, description, point_value, status, created_at)
    VALUES (${title}, ${description}, ${pointValue}, 'open', NOW())
    RETURNING *
  `;
  return result.rows[0];
}

export async function updateBountyStatus(
  id: number,
  status: BountyStatus
): Promise<Bounty | null> {
  const completedAt = status === "completed" ? "NOW()" : null;
  const result = await sql<Bounty>`
    UPDATE bounties
    SET status = ${status},
        completed_at = ${status === "completed" ? new Date().toISOString() : null}
    WHERE id = ${id}
    RETURNING *
  `;
  return result.rows[0] || null;
}

export async function deleteBounty(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM bounties WHERE id = ${id}
  `;
  return result.rowCount !== null && result.rowCount > 0;
}
