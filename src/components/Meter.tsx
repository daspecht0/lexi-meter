"use client";

import { useEffect, useState } from "react";

interface MeterProps {
  value: number;
  note?: string | null;
  updatedAt?: Date | string;
  showControls?: boolean;
  onUpdate?: (value: number, note?: string) => void;
}

export default function Meter({
  value,
  note,
  updatedAt,
  showControls = false,
  onUpdate,
}: MeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [newValue, setNewValue] = useState(value);
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Animate the meter on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getMeterColor = (val: number) => {
    if (val <= 25) return "#32CD32"; // lime
    if (val <= 50) return "#FFE135"; // yellow
    if (val <= 75) return "#FF6B35"; // orange
    return "#FF1493"; // hot pink
  };

  const getMoodEmoji = (val: number) => {
    if (val <= 25) return "😊";
    if (val <= 50) return "😐";
    if (val <= 75) return "😤";
    return "🔥";
  };

  const getMoodText = (val: number) => {
    if (val <= 25) return "Pretty Chill";
    if (val <= 50) return "Slightly Annoyed";
    if (val <= 75) return "Getting Mad";
    return "VERY MAD";
  };

  const handleUpdate = async () => {
    if (!onUpdate) return;
    setIsUpdating(true);
    try {
      await onUpdate(newValue, newNote || undefined);
      setNewNote("");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mood display */}
      <div className="text-center mb-8">
        <div
          className="text-8xl mb-4 animate-bounce-slow"
          style={{ filter: `hue-rotate(${(value / 100) * 60}deg)` }}
        >
          {getMoodEmoji(displayValue)}
        </div>
        <h2
          className="text-4xl font-black tracking-tight"
          style={{ color: getMeterColor(displayValue) }}
        >
          {getMoodText(displayValue)}
        </h2>
      </div>

      {/* Meter visualization */}
      <div className="relative">
        {/* Meter background */}
        <div className="h-16 rounded-full bg-gray-800 overflow-hidden shadow-xl border-4 border-white/20">
          {/* Meter fill */}
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${displayValue}%`,
              background: `linear-gradient(90deg, #32CD32 0%, #FFE135 33%, #FF6B35 66%, #FF1493 100%)`,
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Meter markers */}
        <div className="flex justify-between mt-2 px-2 text-sm font-bold text-white/70">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Value display */}
      <div className="text-center mt-8">
        <div
          className="text-7xl font-black"
          style={{ color: getMeterColor(displayValue) }}
        >
          {displayValue}
        </div>
        <div className="text-white/50 text-sm mt-2">
          {updatedAt && `Last updated: ${formatDate(updatedAt)}`}
        </div>
        {note && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg text-white/80 italic">
            "{note}"
          </div>
        )}
      </div>

      {/* Controls for dashboard */}
      {showControls && (
        <div className="mt-8 p-6 bg-white/10 rounded-2xl space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">
              New Value: {newValue}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={newValue}
              onChange={(e) => setNewValue(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, #32CD32 0%, #FFE135 33%, #FF6B35 66%, #FF1493 100%)`,
              }}
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Note (optional)
            </label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Why this value?"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder:text-white/40 border border-white/20 focus:border-goodles-pink focus:outline-none"
            />
          </div>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-goodles-pink to-goodles-orange hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Meter"}
          </button>
        </div>
      )}
    </div>
  );
}
