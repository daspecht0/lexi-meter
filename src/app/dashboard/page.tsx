"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Meter from "@/components/Meter";
import BountyCard from "@/components/BountyCard";
import BountyForm from "@/components/BountyForm";
import type { MeterReading, Bounty, BountyStatus } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [meterData, setMeterData] = useState<MeterReading | null>(null);
  const [meterHistory, setMeterHistory] = useState<MeterReading[]>([]);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [meterRes, historyRes, bountiesRes] = await Promise.all([
        fetch("/api/meter"),
        fetch("/api/meter?history=true"),
        fetch("/api/bounties"),
      ]);

      if (meterRes.ok) {
        const data = await meterRes.json();
        setMeterData(data);
      }

      if (historyRes.ok) {
        const data = await historyRes.json();
        setMeterHistory(data);
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
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router, fetchData]);

  const handleMeterUpdate = async (value: number, note?: string) => {
    try {
      const res = await fetch("/api/meter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, note }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to update meter:", error);
    }
  };

  const handleBountyCreate = async (
    title: string,
    description: string,
    pointValue: number
  ) => {
    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, point_value: pointValue }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create bounty:", error);
    }
  };

  const handleBountyStatusChange = async (id: number, status: BountyStatus) => {
    try {
      const res = await fetch("/api/bounties", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to update bounty:", error);
    }
  };

  const handleBountyDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this bounty?")) return;

    try {
      const res = await fetch(`/api/bounties?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete bounty:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-white text-2xl animate-pulse">Loading...</div>
      </main>
    );
  }

  if (session?.user?.role !== "lexi") {
    return (
      <main className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl text-white mb-4">Access Denied</h1>
          <p className="text-white/60 mb-6">
            This dashboard is only for Lexi.
          </p>
          <Link
            href="/"
            className="text-goodles-pink hover:underline"
          >
            Back to Meter
          </Link>
        </div>
      </main>
    );
  }

  const openBounties = bounties.filter((b) => b.status === "open");
  const pendingBounties = bounties.filter(
    (b) => b.status === "pending_verification"
  );
  const completedBounties = bounties.filter((b) => b.status === "completed");

  return (
    <main className="min-h-screen py-8 px-4 relative z-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <Link href="/">
          <h1 className="text-3xl font-black bg-gradient-to-r from-goodles-pink via-goodles-yellow to-goodles-orange bg-clip-text text-transparent">
            LEXI METER
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-white/60">Hey, {session?.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Meter Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Update Meter</h2>
          <Meter
            value={meterData?.value ?? 50}
            note={meterData?.note}
            updatedAt={meterData?.updated_at}
            showControls
            onUpdate={handleMeterUpdate}
          />
        </section>

        {/* Meter History */}
        {meterHistory.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Recent History</h2>
            <div className="bg-white/10 rounded-2xl p-4 overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="text-white/50 text-sm">
                    <th className="text-left p-2">Value</th>
                    <th className="text-left p-2">Note</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {meterHistory.slice(0, 5).map((reading, i) => (
                    <tr key={i} className="border-t border-white/10">
                      <td className="p-2 font-bold">{reading.value}</td>
                      <td className="p-2 text-white/60">
                        {reading.note || "-"}
                      </td>
                      <td className="p-2 text-white/40 text-sm">
                        {new Date(reading.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Bounties Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Bounties</h2>

          {/* Create Bounty Form */}
          <div className="mb-8">
            <BountyForm onSubmit={handleBountyCreate} />
          </div>

          {/* Pending Verification */}
          {pendingBounties.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-goodles-yellow mb-4">
                Pending Verification ({pendingBounties.length})
              </h3>
              <div className="space-y-4">
                {pendingBounties.map((bounty) => (
                  <BountyCard
                    key={bounty.id}
                    bounty={bounty}
                    showActions
                    onStatusChange={handleBountyStatusChange}
                    onDelete={handleBountyDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Open Bounties */}
          {openBounties.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-goodles-lime mb-4">
                Open ({openBounties.length})
              </h3>
              <div className="space-y-4">
                {openBounties.map((bounty) => (
                  <BountyCard
                    key={bounty.id}
                    bounty={bounty}
                    showActions
                    onStatusChange={handleBountyStatusChange}
                    onDelete={handleBountyDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Bounties */}
          {completedBounties.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-goodles-purple mb-4">
                Completed ({completedBounties.length})
              </h3>
              <div className="space-y-4">
                {completedBounties.slice(0, 5).map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))}
              </div>
            </div>
          )}

          {bounties.length === 0 && (
            <p className="text-white/50 text-center py-8">
              No bounties yet. Create one above!
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
