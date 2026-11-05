# Product Requirements Document

## Product

**일손이음** is a mobile-first service concept connecting Cheongdo County farms that need seasonal help with young people seeking local, short-term work and agricultural experience.

## Problem

Farmers can struggle to find workers when seasonal work is needed. Young people often cannot easily compare the work, schedule, location, and pay before deciding whether to participate. There is no convenient shared place in this prototype to present those conditions and express interest.

## Goals

- Let young people browse and filter work by keyword, category, schedule, and pay.
- Show the work description, location, date, hours, and daily pay before an application.
- Let a farmer enter the conditions for a work listing with a low-friction form.
- Offer optional AI assistance to compare sample listings and draft clearer descriptions.
- Keep core browsing, application, and listing-demo flows usable without sign-in or AI credentials.
- Design for mobile first while supporting desktop layouts.

## Users

- **Young worker:** reviews opportunities and records a demo application.
- **Farmer:** enters a work listing and can request an optional description draft.

## Primary flows

1. Browse, search, filter, and sort sample farm-work listings.
2. Open a listing, review its conditions, and save a demo application locally.
3. Switch to farmer mode, enter listing details, optionally request an AI description, and save the demo listing locally.
4. Review saved demo applications and listings in the same browser.

## Non-goals and limitations

- This prototype does not authenticate users or transmit applications to farms.
- Listings, pay, and applications are illustrative and stored in browser local storage.
- It is not a production marketplace, employment service, payment system, or verification service.
- AI output is advisory, may be inaccurate, and must not be treated as verified work conditions.
- No real-world impact or service outcome is claimed.

## Success signals for a future pilot

Measure listing completion, successful condition searches, application-flow completion, and user-reported clarity. Establish a baseline with a supervised local pilot before setting targets; this prototype has no production analytics.

## Acceptance criteria

- Primary browse, detail, demo-apply, and create-listing flows work without login.
- Layout remains usable on small mobile screens and larger screens.
- Demo data and local-only actions are clearly labeled.
- AI integrations are optional, expose their availability and errors, and do not block core flows.
- Input is validated server-side and provider credentials remain server-side.
