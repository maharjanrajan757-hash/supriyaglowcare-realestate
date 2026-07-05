import { google } from "googleapis";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type InquiryPayload = {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  propertyTitle?: string;
  propertyLocation?: string;
  propertyPrice?: string;
};

const confirmationMessage =
  "Thank you for your inquiry. Your message has been received and sent for further process. We will contact you soon.";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<InquiryPayload>;
    const validationError = validateInquiry(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const inquiry = payload as InquiryPayload;

    await Promise.all([sendEmails(inquiry), saveToGoogleSheet(inquiry)]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Inquiry submission failed:", error);
    return NextResponse.json(
      { error: "Inquiry could not be submitted. Please try again later." },
      { status: 500 }
    );
  }
}

function validateInquiry(payload: Partial<InquiryPayload>) {
  const requiredFields: Array<keyof InquiryPayload> = ["fullName", "phone", "email", "message"];

  for (const field of requiredFields) {
    if (!payload[field] || !String(payload[field]).trim()) {
      return "Please complete every field before sending your inquiry.";
    }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(payload.email))) {
    return "Please enter a valid email address.";
  }

  return "";
}

async function sendEmails(inquiry: InquiryPayload) {
  // Replace ADMIN_EMAIL in .env.local with the website owner/admin inbox.
  const adminEmail = process.env.ADMIN_EMAIL;
  // Replace SMTP_* values in .env.local with your email provider credentials.
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!adminEmail || !smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    handleMissingIntegrationConfig("SMTP email");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  await transporter.sendMail({
    from: `"Elite Estate" <${smtpUser}>`,
    to: inquiry.email,
    subject: "Your property inquiry has been received",
    text: confirmationMessage,
    html: `<p>${confirmationMessage}</p>`
  });

  await transporter.sendMail({
    from: `"Elite Estate Website" <${smtpUser}>`,
    to: adminEmail,
    replyTo: inquiry.email,
    subject: `New inquiry: ${inquiry.propertyTitle || "Property Listing"}`,
    text: buildAdminEmailText(inquiry),
    html: buildAdminEmailHtml(inquiry)
  });
}

async function saveToGoogleSheet(inquiry: InquiryPayload) {
  // Replace GOOGLE_SHEET_ID in .env.local with the ID from your Google Sheet URL.
  const sheetId = process.env.GOOGLE_SHEET_ID;
  // Share the Google Sheet with this service account email before going live.
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!sheetId || !serviceAccountEmail || !privateKey) {
    handleMissingIntegrationConfig("Google Sheet");
    return;
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Sheet setup: create a tab named "Inquiries" with headers matching this row order.
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Inquiries!A:J",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          inquiry.fullName,
          inquiry.phone,
          inquiry.email,
          inquiry.message,
          inquiry.propertyTitle || "",
          inquiry.propertyLocation || "",
          inquiry.propertyPrice || "",
          "Website Landing Page",
          "New"
        ]
      ]
    }
  });
}

function buildAdminEmailText(inquiry: InquiryPayload) {
  return [
    "New property inquiry received.",
    "",
    `Full Name: ${inquiry.fullName}`,
    `Phone Number: ${inquiry.phone}`,
    `Email Address: ${inquiry.email}`,
    `Message: ${inquiry.message}`,
    `Property: ${inquiry.propertyTitle || ""}`,
    `Location: ${inquiry.propertyLocation || ""}`,
    `Price: ${inquiry.propertyPrice || ""}`
  ].join("\n");
}

function buildAdminEmailHtml(inquiry: InquiryPayload) {
  const rows = [
    ["Full Name", inquiry.fullName],
    ["Phone Number", inquiry.phone],
    ["Email Address", inquiry.email],
    ["Message", inquiry.message],
    ["Property", inquiry.propertyTitle || ""],
    ["Location", inquiry.propertyLocation || ""],
    ["Price", inquiry.propertyPrice || ""]
  ];

  return `
    <h2>New property inquiry received</h2>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
        )
        .join("")}
    </table>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function handleMissingIntegrationConfig(integrationName: string) {
  const message = `Missing ${integrationName} environment variables.`;

  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }

  // Local preview mode: allow the form to redirect while credentials are not set yet.
  console.warn(`${message} Skipping ${integrationName} in development.`);
}
