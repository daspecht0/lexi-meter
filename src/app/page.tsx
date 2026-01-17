"use client";

import { useEffect, useState } from "react";
import Meter from "@/components/Meter";
import BountyCard from "@/components/BountyCard";
import Link from "next/link";
import type { MeterReading, Bounty } from "@/types";

export default function Home() {
  const [meterData, setMeterData] = useState<MeterReading | null>(null);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [meterRes, bountiesRes] = await Promise.all([
          fetch("/api/meter"),
          fetch("/api/bounties?open=true"),
        ]);

        if (meterRes.ok) {
          const data = await meterRes.json();
          setMeterData(data);
        }

        if (bountiesRes.ok) {
          const data = await bountiesRes.json();
          setBounties(data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const currentValue = meterData?.value ?? 50;
  const note = meterData?.note;
  const updatedAt = meterData?.updated_at;

  return (
    <main className="min-h-screen py-12 px-4 relative z-10">
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
        {isLoading ? (
          <div className="text-center text-white/50 animate-pulse">Loading meter...</div>
        ) : (
          <Meter value={currentValue} note={note} updatedAt={updatedAt} />
        )}
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
      <footer className="mt-16 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all"
        >
          <span>Lexi Login</span>
          <span className="text-lg">→</span>
        </Link>
      </footer>
    </main>
  );
}
