# EIU CDS Student Alert System

EIU CDS Student Alert System is a frontend-only MVP web application for the Communication Disorders & Sciences program at Eastern Illinois University. Faculty can sign in with approved Google accounts to submit student alerts, and designated admin users can review all submitted alerts through a protected dashboard.

## Features

- Passwordless email-link sign-in with Firebase Authentication
- Approved-user access control for `@eiu.edu` accounts and named admin exceptions
- Role-based routing for faculty and admin users
- Faculty alert submission form with inline validation
- Firestore storage for submitted alerts
- Admin dashboard with search and severity filtering
- Admin-only alert detail page
- GitHub Pages-ready deployment using `HashRouter`
- Tailwind CSS styling with reusable UI components

## Tech Stack

- React
- Vite
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Tailwind CSS
- React Router

## Access Rules

### Admin users

- `rcwatso@gmail.com`
- `angela.anthony@eiu.edu`

### Faculty users

- Any approved user with an email ending in `@eiu.edu` who is not one of the admin users

### Access behavior

- Unapproved users are immediately signed out
- Unapproved users see: `Access denied. You must sign in with an approved EIU account.`
- Admin users are routed to `/admin`
- Faculty users are routed to `/submit`

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Firebase Setup

This project already includes the Firebase config in [`src/firebase/config.ts`](/Users/rud/Documents/EIU Student Alert/src/firebase/config.ts).

Before using the app, make sure the Firebase console is configured correctly:

1. Create or open the Firebase project `eiu-cds-student-alert`
2. Enable `Email/Password` in Authentication
3. Enable `Email link (passwordless sign-in)` in Authentication
3. Create a Firestore database
4. Add these authorized domains in Firebase Authentication:
   - `localhost`
   - `rcwatso.github.io`

## Firestore Data

Alerts are stored in the `alerts` collection with these key fields:

- Faculty information
- Student information
- Concern type and severity
- Description and evidence
- Follow-up request details
- Core function areas
- Time-sensitive status and urgency explanation
- `createdAt` using `serverTimestamp()`
- `submittedAt` as an ISO fallback string
- Submitter UID and email

## Firestore Security Notes

Firestore security rules should separately enforce:

- Authenticated users only
- Approved faculty can create alerts
- Only admin users can read all alerts

The frontend enforces UI-level access control, but Firestore rules must still protect the data.

## Deployment to GitHub Pages

This project is configured for GitHub Pages with:

- Vite `base` set to `/eiu-cds-student-alert/`
- `HashRouter` for route reliability on Pages
- GitHub Actions workflow in [`.github/workflows/deploy.yml`](/Users/rud/Documents/EIU Student Alert/.github/workflows/deploy.yml)

### Deployment steps

1. Push the repository to GitHub as `rcwatso-slp/eiu-cds-student-alert`
2. In GitHub, open the repository settings
3. Go to `Pages`
4. Set the source to `GitHub Actions`
5. Push to `main` to trigger deployment

## File Structure Summary

```text
src/
  components/
    alerts/
    auth/
    layout/
    ui/
  contexts/
  firebase/
  hooks/
  pages/
  types/
  utils/
```

## Notes for Future Maintenance

- Auth logic is centralized in [`src/contexts/AuthContext.tsx`](/Users/rud/Documents/EIU Student Alert/src/contexts/AuthContext.tsx)
- Approved-user and admin checks live in [`src/utils/auth.ts`](/Users/rud/Documents/EIU Student Alert/src/utils/auth.ts)
- Form options and default values live in [`src/utils/constants.ts`](/Users/rud/Documents/EIU Student Alert/src/utils/constants.ts)
- Date formatting helpers live in [`src/utils/format.ts`](/Users/rud/Documents/EIU Student Alert/src/utils/format.ts)
- The app is intentionally lightweight and avoids extra state-management libraries

## Important MVP Scope Notes

This MVP does not include:

- Email notifications
- File uploads
- Export features
- Edit or delete functionality
- Complex admin management
- Analytics
- Pagination
