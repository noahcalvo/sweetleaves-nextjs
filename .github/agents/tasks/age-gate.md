# Cannabis Site 21+ Age Gate — Implementation Spec

## 1) Goal

Prevent access to cannabis-related site content by users under 21 and demonstrate good-faith compliance. The age gate must block access **before any site content is visible or interactive**.

## 2) Scope

* Applies to **all routes** (home, menu, promos/landing pages, blog, etc.).
* Must appear on first visit and whenever verification expires.

## 3) UX Requirements

### 3.1 Gate UI

* Full-screen overlay (preferred) or centered modal with backdrop.
* Must prevent scrolling/interaction with page behind it.
* Must trap focus inside gate.

### 3.2 Copy (plain and compliant)

**Prompt:** “Are you 21 years of age or older?”

**Buttons:**

* Primary: “Yes, Enter”
* Secondary: “No”

No cannabis imagery, slang, or jokes.

### 3.3 Behavior

* User must choose explicitly.
* Clicking outside the modal must **not** dismiss it.
* Pressing Escape must **not** dismiss it.

### 3.4 “No” Action

* Selecting **“No”** must display a dedicated **exit screen**.
* The exit screen:

  * Clearly states the site is restricted to users 21+
  * Contains **no navigation, links, or interactive elements**
  * Prevents access back into the site without a page reload
* No automatic external redirect is allowed.

## 4) Persistence & Expiration

### 4.1 Storage

* Store verification locally:

  * `ageGate:verified` (boolean)
  * `ageGate:verifiedAt` (timestamp ms)

### 4.2 Duration (config-driven)

* Verification remains valid for a configurable window.
* **Default:** 12 hours.

**Configuration key (preferred):**

* `NEXT_PUBLIC_AGE_GATE_TTL_HOURS`

**Rules:**

* If missing/invalid → fall back to default.
* If set to `0` → always prompt.

### 4.3 Expiration Logic

Gate shows if:

* `verified` not present/false
* or `verifiedAt` missing/invalid
* or `now - verifiedAt > ttl`

## 5) Styling

* Must match the site’s design system:

  * Same fonts
  * Same base colors
  * Same button components/styles
  * Same border radius/shadows
* Should feel native, not like a third-party widget.

## 6) Accessibility

* Focus trap inside the gate.
* Keyboard:

  * Tab cycles within the gate
  * Enter activates focused button
* ARIA:

  * `role="dialog"`, `aria-modal="true"`
  * `aria-labelledby` for title/prompt

## 7) Technical Constraints

* Implemented client-side.
* Must prevent “content flash” (no visible content before decision).

  * Recommended: gate overlay renders immediately; app content stays hidden until verified.
* Works if cookies are blocked (use `localStorage`).

## 8) Pseudologic

```
const ttlHours = parseNumber(process.env.NEXT_PUBLIC_AGE_GATE_TTL_HOURS) ?? 12
const ttlMs = ttlHours * 60 * 60 * 1000

const verified = localStorage.getItem('ageGate:verified') === 'true'
const verifiedAt = Number(localStorage.getItem('ageGate:verifiedAt'))

const isExpired = !Number.isFinite(verifiedAt) || (Date.now() - verifiedAt) > ttlMs

if (!verified || isExpired) {
  showGate()
} else {
  allowSite()
}

onYes() {
  localStorage.setItem('ageGate:verified', 'true')
  localStorage.setItem('ageGate:verifiedAt', String(Date.now()))
  hideGate(); allowSite();
}

onNo() {
  redirectTo(process.env.NEXT_PUBLIC_AGE_GATE_EXIT_URL ?? 'https://www.google.com')
}
```

## 9) Non-Goals

* No DOB collection
* No ID verification
* No personal data storage
* No analytics required

## 10) Acceptance Criteria

* First-time visitor cannot see or interact with site content until confirming 21+.
* Verification persists for configured TTL, then re-prompts.
* Clearing localStorage triggers prompt again.
* Gate appears on all routes.
* Gate cannot be dismissed without choosing Yes/No.
