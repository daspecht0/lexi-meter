import { Resend } from "resend";

const FROM_EMAIL = "Lexi Meter <onboarding@resend.dev>";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not configured");
  }
  return new Resend(apiKey);
}

export async function sendDailyReminder(currentValue: number) {
  const lexiEmail = process.env.LEXI_EMAIL;
  if (!lexiEmail) {
    console.error("LEXI_EMAIL not configured");
    return { success: false, error: "LEXI_EMAIL not configured" };
  }

  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  try {
    const { data, error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: lexiEmail,
      subject: "How mad are you today? Update your meter!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #FF1493; text-align: center;">Lexi Meter Check-In</h1>
          <p style="font-size: 18px; text-align: center;">
            Your current meter value is: <strong style="font-size: 24px; color: #FF6B35;">${currentValue}</strong>
          </p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #FF1493, #FF6B35); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Update Your Meter
            </a>
          </p>
          <p style="color: #666; text-align: center; font-size: 14px;">
            Let everyone know how you're feeling today!
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send daily reminder:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error sending daily reminder:", err);
    return { success: false, error: err };
  }
}

export async function sendBountyPostedNotification(
  title: string,
  description: string,
  pointValue: number
) {
  const userEmail = process.env.USER_EMAIL;
  if (!userEmail) {
    console.error("USER_EMAIL not configured");
    return { success: false, error: "USER_EMAIL not configured" };
  }

  try {
    const { data, error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `New Bounty Posted: ${title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #9B59B6; text-align: center;">New Bounty Available!</h1>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #FF6B35; margin-top: 0;">${title}</h2>
            <p style="font-size: 16px;">${description}</p>
            <p style="font-size: 18px; color: #32CD32; font-weight: bold;">
              Worth: ${pointValue} points toward the meter!
            </p>
          </div>
          <p style="color: #666; text-align: center; font-size: 14px;">
            Complete this bounty to bring down Lexi's anger level!
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send bounty notification:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error sending bounty notification:", err);
    return { success: false, error: err };
  }
}

export async function sendBountyCompletedNotification(
  title: string,
  pointValue: number
) {
  const userEmail = process.env.USER_EMAIL;
  if (!userEmail) {
    console.error("USER_EMAIL not configured");
    return { success: false, error: "USER_EMAIL not configured" };
  }

  try {
    const { data, error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `Bounty Completed: ${title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #32CD32; text-align: center;">Bounty Verified!</h1>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h2 style="color: #FF6B35; margin-top: 0;">${title}</h2>
            <p style="font-size: 24px; color: #32CD32; font-weight: bold;">
              +${pointValue} points applied!
            </p>
            <p style="font-size: 16px;">
              Lexi's meter has been reduced. Great job!
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send completion notification:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error sending completion notification:", err);
    return { success: false, error: err };
  }
}
