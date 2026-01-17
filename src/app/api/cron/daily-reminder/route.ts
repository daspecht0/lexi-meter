import { NextRequest, NextResponse } from "next/server";
import { getCurrentMeter } from "@/lib/db";
import { sendDailyReminder } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentMeter = await getCurrentMeter();
    const currentValue = currentMeter?.value ?? 50;

    const result = await sendDailyReminder(currentValue);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Daily reminder sent",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
