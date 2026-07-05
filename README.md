# Premium Real Estate Landing Page

Next.js landing page for a premium property listing with an inquiry form, confirmation email, admin email notification, and Google Sheet storage.

## Edit Listing Details

Replace the listing content in `app/page.tsx` inside the `property` object:

- property title
- location
- price
- short description
- contact name
- contact number
- property facts
- image URLs

## Environment Setup

Create `.env.local` from `.env.example`:

```env
ADMIN_EMAIL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
GOOGLE_SHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

For Google Sheets, create a sheet tab named `Inquiries` and share the Sheet with `GOOGLE_SERVICE_ACCOUNT_EMAIL`.

Recommended headers for `Inquiries!A:J`:

```text
Submitted At, Full Name, Phone, Email, Message, Property, Location, Price, Source, Status
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.
