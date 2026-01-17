import Meter from "@/components/Meter";
import BountyCard from "@/components/BountyCard";
import { getCurrentMeter, getOpenBounties } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let meterData: Awaited<ReturnType<typeof getCurrentMeter>> = null;
  let bounties: Awaited<ReturnType<typeof getOpenBounties>> = [];

  try {
    meterData = await getCurrentMeter();
    bounties = await getOpenBounties();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  const currentValue = meterData?.value ?? 50;
  const note = meterData?.note ?? null;
  const updatedAt = meterData?.updated_at ?? null;

  return (
    <main className="min-h-screen py-12 px-4">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-goodles-pink via-goodles-yellow to-goodles-orange bg-clip-text text-transparent animate-pulse-slow text-glow">
          LEXI METER
        </h1>
        <p className="text-white/60 mt-4 text-lg">
          How mad is Lexi right now?
        </p>
      </header>

      {/* Main Meter */}
      <section className="mb-16">
        <Meter value={currentValue} note={note} updatedAt={updatedAt} />
      </section>

      {/* Bounties Section */}
      {bounties.length > 0 && (
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            <span className="text-goodles-lime">Open Bounties</span>
            <span className="text-white/50 text-lg ml-2">
              (ways to reduce the meter)
            </span>
          </h2>
          <div className="space-y-4">
            {bounties.map((bounty) => (
              <BountyCard key={bounty.id} bounty={bounty} />
            ))}
          </div>
        </section>
      )}

      {/* Login link for Lexi */}
      <footer className="fixed bottom-4 right-4">
        <Link
          href="/login"
          className="text-white/30 hover:text-white/60 text-sm transition-colors"
        >
          Lexi Login
        </Link>
      </footer>
    </main>
  );
}
