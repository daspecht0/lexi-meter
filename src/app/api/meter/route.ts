import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentMeter, getMeterHistory, updateMeter } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const history = searchParams.get("history");

    if (history === "true") {
      const readings = await getMeterHistory(10);
      return NextResponse.json(readings);
    }

    const current = await getCurrentMeter();
    return NextResponse.json(current || { value: 50, note: null, updated_at: null });
  } catch (error) {
    console.error("Failed to get meter:", error);
    return NextResponse.json(
      { error: "Failed to fetch meter data" },
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
    const { value, note } = body;

    if (typeof value !== "number" || value < 0 || value > 100) {
      return NextResponse.json(
        { error: "Value must be between 0 and 100" },
        { status: 400 }
      );
    }

    const updated = await updateMeter(value, note || null);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update meter:", error);
    return NextResponse.json(
      { error: "Failed to update meter" },
      { status: 500 }
    );
  }
}
