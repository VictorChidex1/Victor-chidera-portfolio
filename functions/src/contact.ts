// Secure contact-form handler: validates input server-side, persists the lead to
// Firestore, then sends a notification email via Resend. The Resend API key is
// read from Firebase Secret Manager and never leaves the server.

import { createHash } from "node:crypto";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import { Resend } from "resend";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "./firebase";

export const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

const REGION = "us-central1";
const FROM_ADDRESS = "Victor Chidera <hello@send.victorchidera.com>";
const TO_ADDRESS = ["victor@victorchidera.com"];

// Rate limiting: at most RATE_MAX submissions per email within RATE_WINDOW_MS.
const RATE_MAX = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  company?: string;
  service?: string;
  budget?: string;
  website?: string; // honeypot — must stay empty
}

interface ContactData {
  name: string;
  email: string;
  message: string;
  company: string;
  service: string;
  budget: string;
}

/** Escape HTML in user-provided values before embedding them in the email. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Lightweight Firestore-backed rate limiter keyed by a hash of the sender email. */
async function enforceRateLimit(email: string): Promise<void> {
  const id = createHash("sha256").update(email.toLowerCase()).digest("hex");
  const ref = db.collection("rateLimits").doc(id);
  const now = Date.now();
  let limited = false;

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      tx.set(ref, { count: 1, windowStart: now });
      return;
    }
    const data = snap.data() as { count: number; windowStart: number };
    if (now - data.windowStart > RATE_WINDOW_MS) {
      tx.set(ref, { count: 1, windowStart: now });
      return;
    }
    if (data.count >= RATE_MAX) {
      limited = true;
      return;
    }
    tx.update(ref, { count: FieldValue.increment(1) });
  });

  if (limited) {
    throw new HttpsError(
      "resource-exhausted",
      "Too many submissions. Please try again later."
    );
  }
}

/** Build a clean, responsive HTML notification email. */
function buildEmailHtml(data: ContactData): string {
  const rows = [
    { label: "Name", value: data.name },
    { label: "Email", value: data.email },
    ...(data.company ? [{ label: "Company", value: data.company }] : []),
    ...(data.service ? [{ label: "Service", value: data.service }] : []),
    ...(data.budget ? [{ label: "Budget", value: data.budget }] : []),
    { label: "Message", value: data.message, multiline: true },
  ];

  const rowHtml = rows
    .map((row) => {
      const body = row.multiline
        ? `<div style="margin-top:6px;padding:12px 14px;background:#f7f7f7;border:1px solid #ececec;border-radius:8px;white-space:pre-wrap;line-height:1.6;">${escapeHtml(row.value)}</div>`
        : `<div style="margin-top:4px;font-size:15px;color:#161616;">${escapeHtml(row.value)}</div>`;
      return `
      <div style="margin-bottom:18px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#8a8a8a;">${row.label}</div>
        ${body}
      </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e5e5;">
      <div style="background:#111111;padding:26px 28px;">
        <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#f97316;">New Enquiry</div>
        <div style="font-size:24px;font-weight:700;color:#ffffff;margin-top:6px;">Portfolio Contact Request</div>
      </div>
      <div style="padding:26px 28px;">
        ${rowHtml}
        <div style="margin-top:22px;padding-top:18px;border-top:1px solid #ececec;font-size:12px;color:#8a8a8a;">
          Sent from victorchidera.com · reply will be addressed to the sender&apos;s email above.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export const sendContactEmail = onCall(
  {
    region: REGION,
    timeoutSeconds: 30,
    maxInstances: 3,
    concurrency: 80,
    memory: "256MiB",
    cpu: 1,
    minInstances: 0,
    secrets: [RESEND_API_KEY],
  },
  async (req) => {
    const apiKey = RESEND_API_KEY.value();
    const payload = (req.data ?? {}) as ContactPayload;

    // Honeypot: silently succeed so bots believe their submission went through.
    if (typeof payload.website === "string" && payload.website.length > 0) {
      return { ok: true };
    }

    const data: ContactData = {
      name: typeof payload.name === "string" ? payload.name.trim() : "",
      email: typeof payload.email === "string" ? payload.email.trim() : "",
      message: typeof payload.message === "string" ? payload.message.trim() : "",
      company: typeof payload.company === "string" ? payload.company.trim() : "",
      service: typeof payload.service === "string" ? payload.service.trim() : "",
      budget: typeof payload.budget === "string" ? payload.budget.trim() : "",
    };

    // Server-side validation — never trust the client.
    const invalid: string[] = [];
    if (data.name.length === 0 || data.name.length > 100) invalid.push("name");
    if (!EMAIL_RE.test(data.email) || data.email.length > 254) invalid.push("email");
    if (data.message.length < 5 || data.message.length > 3000) invalid.push("message");
    if (data.company.length > 200) invalid.push("company");
    if (data.service.length > 100) invalid.push("service");
    if (data.budget.length > 100) invalid.push("budget");
    if (invalid.length > 0) {
      throw new HttpsError("invalid-argument", "Invalid submission", { fields: invalid });
    }

    await enforceRateLimit(data.email);

    // Persist the lead (Admin SDK bypasses rules; public create is disabled).
    const leadRef = await db.collection("contacts").add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Send the notification email.
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: TO_ADDRESS,
        replyTo: data.email,
        subject: `New Portfolio Enquiry from ${data.name}`,
        html: buildEmailHtml(data),
      });
      if (error) throw error;
    } catch (err) {
      logger.error("sendContactEmail: Resend failed", { error: err, email: data.email });
      // Remove the orphaned lead so a retry doesn't duplicate it.
      await leadRef.delete().catch((delErr) => {
        logger.warn("sendContactEmail: failed to clean up lead", delErr);
      });
      throw new HttpsError(
        "internal",
        "Unable to send your message. Please try again in a moment."
      );
    }

    return { ok: true };
  }
);