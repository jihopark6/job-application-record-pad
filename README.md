# Job Application History

A lightweight **Progressive Web App (PWA)** to track your job search — no account, no server, no setup. Everything stays on your device.

---

## Features

- **Add & manage applications** — log company name, job title, application date, contact info, and the original job posting URL
- **Track status** — mark each application as Applied, In Review, Interviewed, Accepted, or Rejected
- **Memos** — attach free-form notes to each application (follow-up reminders, interview prep, impressions, etc.)
- **Offline-ready** — works without an internet connection once loaded (PWA)

---

## Installation

This is a static web application. No server-side language runtime (PHP, ASP.NET, JSP, etc.) is required — any standard web server will work.

### Option 1 – Apache
Place the project folder inside your web root (e.g. `/var/www/html/`) and navigate to it in your browser.

### Option 2 – Nginx
Serve the project directory as a static site. No special configuration is needed beyond a basic `root` directive.

### Option 3 – IIS
Add the project folder as a site or virtual directory. No application pool or framework configuration is required.


> **Note:** Do not open `index.html` directly via `file://` — PWA service workers require an HTTP/HTTPS context to function.

---

## Usage

1. Open the app in your browser.
2. Click **New** to log a new job application.
3. Fill in the details: company name, job title, application date, contact info, job posting URL, and initial status.
4. Click into any entry to edit details, update the status.
5. Use the status filter to focus on specific stages of your pipeline.

---

## Data & Storage

- All data is persisted in your browser's **`localStorage`**.
- Data is **tied to the browser and device** — it will not sync across devices or browsers.
- Clearing your browser's site data will **permanently delete** all application records. Consider exporting your data periodically as a backup.
- `localStorage` has a typical browser limit of **~5 MB**, which is sufficient for hundreds of application records.

---

## Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome / Edge (Chromium) | Full PWA support |
| Firefox | Limited PWA install support |
| Safari (iOS / macOS) | PWA add-to-homescreen supported on iOS 16.4+ |
| Internet Explorer | Not supported |
