# Bhardwaj Chasma Ghar — Complete Eye Care & Optical Management System

**Positioning:** Complete Eye Care & Optical Solutions  
**Phase:** Phase 1 — Production-Ready Foundation  
**Headquarters:** Shop No. 12-14, Medical Complex, Main Market, Civil Lines, Kanpur, Uttar Pradesh - 208001  
**GSTIN:** `09AAEFB1234K1ZV`

---

## 🌟 Overview

**Bhardwaj Chasma Ghar** is a specialized, production-ready web application engineered specifically for the Indian optical and clinical eye-care business model. It unifies clinical ophthalmic care, computerized refractive examinations, doctor prescriptions, lens laboratory production pipelines, frame inventory, GST tax invoicing, advance/due payment tracking, and frame repairs under a single connected database.

Unlike generic hospital templates or e-commerce clones, this system respects the genuine boundary between **Medical Clinical Care** and **Optical Workshop Dispensing**.

---

## 🏢 Core Business Workflow (End-to-End)

```
Patient Registration
       ↓
Doctor Eye Examination (Autorefraction, SPH, CYL, AXIS, ADD, PD, IOP)
       ↓
Doctor Prescription & Medicines (Rx Pad)
       ↓
"SAVE & SEND TO OPTICAL" (Auto-generates Optical Job e.g. BCG-00125)
       ↓
Optical Staff Receives Job in Real-Time
       ↓
Frame Selection (from live inventory) & Lens Package Selection
       ↓
Automated Price Calculation (Frame + Lens + Fitting - Discount = Total)
       ↓
Advance Payment & Balance Due Recording
       ↓
Automated GST Tax Invoice Generation
       ↓
Workshop Production Pipeline:
  [Prescription Received] → [Frame Selected] → [Lens Processing] →
  [Fitting in Workshop] → [Quality Check] → [Ready for Collection] → [Delivered]
       ↓
Customer 360° Profile & Live Chasma Tracker
```

---

## 👥 User Roles & Role-Based Access Control (RBAC)

| Role | Default User | Default Credentials | Primary Responsibilities |
|---|---|---|---|
| **DOCTOR** | Dr. Alok Bhardwaj (MS Ophthalmology) | `doctor@bhardwajchasma.com` / `doctor` | Eye examinations, refraction, medicine prescription, Rx reports, **"Save & Send to Optical"** |
| **STAFF** | Manoj Sharma (Senior Optometrist) | `staff@bhardwajchasma.com` / `staff` | Optical jobs, frame/lens selection, billing calculation, workshop status updates, repair tickets |
| **CUSTOMER** | Rahul Sharma | `9876543210` / `user` | View own prescriptions, live chasma production pipeline tracker, balance dues, invoices, repair tickets |
| **ADMIN** | Rajeev Bhardwaj | `admin@bhardwajchasma.com` / `admin` | Complete oversight, revenue analytics, frame stock, staff permission toggles, business settings, audit trail |

*(Note: The login page includes an **Instant 1-Click Role Switcher** for instant pair evaluation!)*

---

## 📐 Key Features Implemented (Phase 1)

1. **Doctor OPD Panel (`doctor.html` / `js/doctor.js`)**:
   - Patient search by phone/name to prevent duplicate registrations.
   - Refraction table for Right Eye (OD) and Left Eye (OS): SPH, CYL, AXIS, ADD, Visual Acuity.
   - Intraocular Pressure (IOP) and Pupillary Distance (PD) in millimeters.
   - Prescribed medicines builder (Name, dosage, frequency, duration, instructions).
   - Official printable **Rx Medical Prescription Pad** with doctor signature block.
   - **"Save & Send to Optical"** workflow creating linked optical jobs (`BCG-XXXXX`).

2. **Optical Staff & Workshop Panel (`staff.html` / `js/staff.js`)**:
   - Queue of incoming doctor prescriptions.
   - Frame selection from live stock with auto-fill prices.
   - Lens package selection (Crizal, Zeiss, Blue-Shield, Freeform Progressives).
   - Reliable price engine: Total Amount, Advance Paid, Balance Due.
   - 7-Stage Production Pipeline with audit timestamped notes.
   - Repair center management (`REP-XXXXX`): Problem, estimated cost, advance, due, and status progression.

3. **Customer / Patient Portal (`customer.html` / `js/customer.js`)**:
   - **My Chasma Live Tracker**: Visual pipeline stepper showing exact fabrication stage (e.g., *Lens Processing*), expected delivery date, advance, and due balance.
   - Complete prescription history with printable Rx pad access.
   - Invoices and repair tracking.
   - Strict medical privacy (IDOR protection).

4. **Customer 360° Profile Viewer (`js/app.js`)**:
   - Available to Doctor, Staff, and Admin when viewing any customer.
   - Unified lifetime view of examinations, prescriptions, optical orders, repairs, total spend, and outstanding dues.

5. **Admin Enterprise Control (`admin.html` / `js/admin.js`)**:
   - Revenue and pending dues analytics in INR (₹).
   - Frame catalog inventory management with low-stock alerts.
   - Granular staff permission toggles.
   - Clinical audit trail.
   - Business & GST settings.

6. **Public Website (`index.html`, `about.html`, `eyecare.html`, `procedures.html`, `store.html`, `contact.html`)**:
   - Clean, modern healthcare aesthetic using Google Fonts (*Plus Jakarta Sans* & *Inter*).
   - Curated frame catalog with category/brand filters and modal specifications.
   - Educational surgery and eye procedure guides.
   - Store address, timings, and Google Maps embed.
   - Strict Phase 1 compliance: **NO appointment booking**.

---

## 💻 Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Centralized Design System), Modern Vanilla JavaScript (ES6+).
- **Data Layer**: Relational data engine (`localStorage` `bcg_optical_system_v1`) pre-seeded with realistic Indian optical clinical data.
- **Styling**: Centralized design tokens in `css/style.css` (Print stylesheet with `@media print` for Rx slips and GST invoices).

---

## 🚀 Running the Project Locally

The project can be run directly using any HTTP server:

```bash
# Python 3
python3 -m http.server 8000

# Open in browser:
http://localhost:8000/chasma-demo/
```

Or open `index.html` directly in any modern web browser.
