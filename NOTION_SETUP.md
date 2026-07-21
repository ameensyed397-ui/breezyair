# Notion CRM Setup

The site writes leads and bookings straight into your Notion workspace. Follow
these steps once, then set the env vars — no code changes needed.

## 1. Create a Notion integration

1. Go to <https://www.notion.so/my-integrations> → **New integration**.
2. Name it "Breezyair CRM", give it **Insert content** + **Read content** capabilities.
3. Copy the **Internal Integration Secret** → this is `NOTION_TOKEN`.

## 2. Create the databases

Create two databases (a third is optional). Property **names and types must match
exactly** — the adapter maps onto these.

### Timestamps

The adapter writes an explicit **`Created`** Date property on every lead, appointment, and
B2B lead. This is the primary field for FIFO job sorting — sort your Leads view
by **Created** (ascending) to process oldest leads first.

Notion also has a built-in **Created time** property type (auto-populated, read-only).
You can add it as a secondary timestamp, but the adapter does not use it.

### Leads  → `NOTION_LEADS_DB`

| Property     | Type       | Notes                                        |
|--------------|------------|----------------------------------------------|
| `Name`       | Title      | Customer name                                |
| `Phone`      | Phone      | Required on every lead                       |
| `Locality`   | Select     | Koramangala, HSR Layout, Indiranagar, Whitefield, Bellandur, Other |
| `Issue`      | Text       | What the customer needs                      |
| `Urgency`    | Select     | Normal, Urgent                               |
| `Source`     | Select     | Website, Call-In, Missed-Call, WhatsApp      |
| `Status`     | Select     | New, Contacted, Booked, Serviced, Closed     |
| `Consent`    | Checkbox   | Customer agreed to be contacted              |
| `Created`    | **Date**   | When the lead was created — **sort by this for FIFO** |
| `Transcript` | Text       | Optional conversation/notes summary          |

### Appointments  → `NOTION_APPOINTMENTS_DB`

| Property     | Type     | Notes                                                   |
|--------------|----------|---------------------------------------------------------|
| `Name`       | Title    | Auto-filled: `phone — timeWindow` (e.g. `+91… — morning`) |
| `Phone`      | Phone    | Links the appointment back to the lead                  |
| `Slot`       | **Date** | The booking date — shows up on Notion Calendar          |
| `Locality`   | Select   | Same options as Leads                                    |
| `Status`     | Select   | Scheduled, En Route, Done, No-show                       |
| `Created`    | **Date** | When the appointment was booked — **sort by this for FIFO** |
| `Technician` | Text     | Optional                                                 |

> **Note:** `Slot` must be a **Date** property (not Text) so appointments appear
> on Notion Calendar. The adapter writes the date part; the time window
> (morning/afternoon/evening) is kept in the `Name`.

### B2B Leads  → `NOTION_B2B_LEADS_DB`

Dedicated database for commercial enquiries — separates B2B sales pipeline from residential leads.

| Property        | Type       | Notes                                        |
|-----------------|------------|----------------------------------------------|
| `Company Name`  | Title      | Business / company name                       |
| `Contact Person`| Text       | Primary contact name                          |
| `Phone`         | Phone      | Required on every lead                        |
| `Email`         | Email      | Business email                                |
| `Business Type` | Select     | Corporate Office, Restaurant / Cafe, Retail Store / Showroom, Clinic / Lab, Gym / Studio, Server Room / Data Center, Apartment Association, Other Facility |
| `AC Units`      | Number     | Estimated number of AC units on premises      |
| `Message`       | Text       | Requirements / additional details             |
| `Source`        | Select     | Website, Call-In, Referral                    |
| `Status`        | Select     | New, Survey Scheduled, Quoted, Contracted, Closed |
| `Created`       | **Date**   | When the enquiry was submitted — **sort by this for FIFO** |

> B2B enquiries write to both the general Leads DB (for CRM consistency) AND
> this dedicated B2B Leads DB (for sales pipeline tracking). Set
> `NOTION_B2B_LEADS_DB` to enable. Unset → B2B leads still save to the general
> Leads DB, just no dedicated pipeline record.

### AMC Contracts  → `NOTION_AMC_DB`

One row per annual maintenance plan sold. Populated automatically when a customer
books an AMC plan, and queried by Breezy Care to send renewal reminders.

| Property        | Type     | Notes                                             |
|-----------------|----------|---------------------------------------------------|
| `Name`          | Title    | Customer name                                     |
| `Phone`         | Phone    | Customer phone                                     |
| `Plan`          | Select   | Chill Basic, Bengaluru Cool, Villa Plan           |
| `Amount`        | **Number** | Total annual amount (INR)                        |
| `Locality`      | Select   | Same options as Leads                             |
| `Start Date`    | **Date** | Contract start                                    |
| `Renewal Date`  | **Date** | Auto-set to Start + 1 year; Breezy Care watches this |
| `Status`        | Select   | Active, Expiring, Expired, Cancelled              |
| `AC Units`      | Number   | For per-AC plans (Villa)                           |

> Breezy Care's daily job queries this DB for contracts where `Status = Active`
> and `Renewal Date` is within the next 30 days, then sends a renewal reminder.
> Renewal querying is best-effort — if it fails it logs and skips (never crashes
> the batch). Optional: `NOTION_AMC_DB` unset → AMC bookings still create a Lead,
> just no contract record.

### Technicians (optional)  → `NOTION_TECHNICIANS_DB`

Not required yet — booking works without it. Reserved for live technician
availability later.

## 3. Share the databases with the integration

Open each database → top-right **•••** → **Connections** → add "Breezyair CRM".
(Without this, the API returns 404s.)

## 4. Get the database IDs

Open a database as a full page. The ID is the 32-char string in the URL:
`https://www.notion.so/<workspace>/<DATABASE_ID>?v=...`

## 5. Set the env vars

In `.env.local` (local) and in Vercel project settings (production):

```bash
NOTION_TOKEN=secret_xxx
NOTION_LEADS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_APPOINTMENTS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_AMC_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx        # AMC Contracts — enables renewal tracking + reminders
NOTION_B2B_LEADS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # B2B Leads — commercial enquiry pipeline
# NOTION_TECHNICIANS_DB=...   # optional
```

That's it. With `NOTION_TOKEN` unset the app falls back to a safe stub (logs
only), so local development and previews keep working without credentials.

## Notes

- Databases must be **single-source** (the default when you create one in the
  Notion UI). The adapter creates pages via `database_id`.
- Select options are created on-the-fly by Notion when first written, but it's
  cleaner to pre-create the options listed above so the colours/order are tidy.
