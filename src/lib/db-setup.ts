import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

async function setupDatabase() {
  console.log("Setting up database tables...");

  // Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'viewer'
    )
  `;
  console.log("Created users table");

  // Create meter table
  await sql`
    CREATE TABLE IF NOT EXISTS meter (
      id SERIAL PRIMARY KEY,
      value INTEGER NOT NULL CHECK (value >= 0 AND value <= 100),
      updated_at TIMESTAMP DEFAULT NOW(),
      note TEXT
    )
  `;
  console.log("Created meter table");

  // Create bounties table
  await sql`
    CREATE TABLE IF NOT EXISTS bounties (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      point_value INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'open',
      created_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP
    )
  `;
  console.log("Created bounties table");

  // Check if Lexi user exists, create if not
  const lexiEmail = process.env.LEXI_EMAIL;
  if (lexiEmail) {
    const existing = await sql`SELECT * FROM users WHERE email = ${lexiEmail}`;
    if (existing.rows.length === 0) {
      // Generate a random password for first-time setup
      const tempPassword = "changeme123";
      const passwordHash = await bcrypt.hash(tempPassword, 10);
      await sql`
        INSERT INTO users (email, password_hash, name, role)
        VALUES (${lexiEmail}, ${passwordHash}, 'Lexi', 'lexi')
      `;
      console.log(`Created Lexi user with email: ${lexiEmail}`);
      console.log(`IMPORTANT: Default password is "changeme123" - change this!`);
    } else {
      console.log("Lexi user already exists");
    }
  } else {
    console.log("LEXI_EMAIL not set - skipping Lexi user creation");
  }

  // Initialize meter with default value if empty
  const meterCheck = await sql`SELECT * FROM meter LIMIT 1`;
  if (meterCheck.rows.length === 0) {
    await sql`INSERT INTO meter (value, note) VALUES (50, 'Initial value')`;
    console.log("Initialized meter with default value of 50");
  }

  console.log("Database setup complete!");
}

setupDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Database setup failed:", err);
    process.exit(1);
  });
