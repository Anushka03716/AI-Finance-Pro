"use server";

import { Resend } from "resend";
import { auth } from "@clerk/nextjs/server";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";

export async function sendEmail({ to, subject, react }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Arcjet protection
    const req = await request();

    const decision = await aj.protect(req, {
      userId,
      requested: 2, // email actions are expensive
    });

    if (decision.isDenied()) {
      throw new Error("Too many requests. Please try again later.");
    }

    const resend = new Resend(process.env.RESEND_API_KEY || "");

    const data = await resend.emails.send({
      from: "Finance App <onboarding@resend.dev>",
      to,
      subject,
      react,
    });

    return { success: true, data };

  } catch (error) {
    console.error("Failed to send email:", error);

    return {
      success: false,
      error: error.message || "Email sending failed",
    };
  }
}