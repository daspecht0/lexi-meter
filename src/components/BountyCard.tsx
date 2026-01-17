"use client";

import type { Bounty } from "@/types";

interface BountyCardProps {
  bounty: Bounty;
  showActions?: boolean;
  onStatusChange?: (id: number, status: "pending_verification" | "completed") => void;
  onDelete?: (id: number) => void;
}

export default function BountyCard({
  bounty,
  showActions = false,
  onStatusChange,
  onDelete,
}: BountyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-goodles-lime text-black";
      case "pending_verification":
        return "bg-goodles-yellow text-black";
      case "completed":
        return "bg-goodles-purple text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "pending_verification":
        return "Pending Verification";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:border-goodles-pink transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{bounty.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
            bounty.status
          )}`}
        >
          {getStatusLabel(bounty.status)}
        </span>
      </div>

      <p className="text-white/70 mb-4">{bounty.description}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-goodles-lime font-black text-2xl">
            -{bounty.point_value}
          </span>
          <span className="text-white/50 text-sm">points</span>
        </div>
        <span className="text-white/40 text-sm">
          {formatDate(bounty.created_at)}
        </span>
      </div>

      {showActions && bounty.status !== "completed" && (
        <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
          {bounty.status === "open" && (
            <button
              onClick={() => onStatusChange?.(bounty.id, "pending_verification")}
              className="flex-1 py-2 px-4 rounded-lg font-bold text-black bg-goodles-yellow hover:opacity-90 transition-opacity"
            >
              Mark Pending
            </button>
          )}
          {bounty.status === "pending_verification" && (
            <button
              onClick={() => onStatusChange?.(bounty.id, "completed")}
              className="flex-1 py-2 px-4 rounded-lg font-bold text-white bg-goodles-lime hover:opacity-90 transition-opacity"
            >
              Verify Complete
            </button>
          )}
          <button
            onClick={() => onDelete?.(bounty.id)}
            className="py-2 px-4 rounded-lg font-bold text-white bg-red-500/50 hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {bounty.status === "completed" && bounty.completed_at && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center text-goodles-lime">
          Completed on {formatDate(bounty.completed_at)}
        </div>
      )}
    </div>
  );
}
