import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAllBounties,
  getOpenBounties,
  createBounty,
  updateBountyStatus,
  deleteBounty,
  getBountyById,
  getCurrentMeter,
  updateMeter,
} from "@/lib/db";
import {
  sendBountyPostedNotification,
  sendBountyCompletedNotification,
} from "@/lib/email";
import type { BountyStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const openOnly = searchParams.get("open") === "true";

    // Non-authenticated users only see open bounties
    if (!session || session.user?.role !== "lexi") {
      const bounties = await getOpenBounties();
      return NextResponse.json(bounties);
    }

    // Lexi sees all bounties
    const bounties = openOnly ? await getOpenBounties() : await getAllBounties();
    return NextResponse.json(bounties);
  } catch (error) {
    console.error("Failed to get bounties:", error);
    return NextResponse.json(
      { error: "Failed to fetch bounties" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "lexi") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, point_value } = body;

    if (!title || !description || typeof point_value !== "number") {
      return NextResponse.json(
        { error: "Title, description, and point_value are required" },
        { status: 400 }
      );
    }

    const bounty = await createBounty(title, description, point_value);

    // Send email notification
    await sendBountyPostedNotification(title, description, point_value);

    return NextResponse.json(bounty);
  } catch (error) {
    console.error("Failed to create bounty:", error);
    return NextResponse.json(
      { error: "Failed to create bounty" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "lexi") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses: BountyStatus[] = [
      "open",
      "pending_verification",
      "completed",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get the bounty before updating
    const bounty = await getBountyById(id);
    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    const updated = await updateBountyStatus(id, status);

    // If bounty is completed, reduce the meter and send notification
    if (status === "completed" && bounty.status !== "completed") {
      const currentMeter = await getCurrentMeter();
      const currentValue = currentMeter?.value ?? 50;
      const newValue = Math.max(0, currentValue - bounty.point_value);

      await updateMeter(
        newValue,
        `Bounty completed: ${bounty.title} (-${bounty.point_value})`
      );

      await sendBountyCompletedNotification(bounty.title, bounty.point_value);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update bounty:", error);
    return NextResponse.json(
      { error: "Failed to update bounty" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "lexi") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = await deleteBounty(Number(id));

    if (!deleted) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete bounty:", error);
    return NextResponse.json(
      { error: "Failed to delete bounty" },
      { status: 500 }
    );
  }
}
