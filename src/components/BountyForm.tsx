"use client";

import { useState } from "react";

interface BountyFormProps {
  onSubmit: (title: string, description: string, pointValue: number) => Promise<void>;
}

export default function BountyForm({ onSubmit }: BountyFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointValue, setPointValue] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title, description, pointValue);
      setTitle("");
      setDescription("");
      setPointValue(10);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-goodles-purple to-goodles-pink hover:opacity-90 transition-opacity text-lg"
      >
        + Create New Bounty
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 rounded-2xl p-6 border border-goodles-purple space-y-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">New Bounty</h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-white/50 hover:text-white"
        >
          Cancel
        </button>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder:text-white/40 border border-white/20 focus:border-goodles-purple focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the task in detail..."
          rows={3}
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder:text-white/40 border border-white/20 focus:border-goodles-purple focus:outline-none resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-2">
          Point Value: {pointValue}
        </label>
        <input
          type="range"
          min="5"
          max="50"
          step="5"
          value={pointValue}
          onChange={(e) => setPointValue(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-goodles-lime to-goodles-purple"
        />
        <div className="flex justify-between text-white/50 text-xs mt-1">
          <span>5</span>
          <span>50</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title || !description}
        className="w-full py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-goodles-purple to-goodles-pink hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Bounty"}
      </button>
    </form>
  );
}
