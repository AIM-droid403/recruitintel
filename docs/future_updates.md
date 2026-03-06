# Future Updates: Google Workspace Integration

This document outlines the architecture and implementation details for the Google Workspace integration (OAuth and Calendar) for RecruitIntel. These changes were previously implemented but are currently shelved for future consideration.

## 1. Google OAuth (Sign-In)

### Changes Required:
- **Backend Dependencies**: Install `google-auth-library`.
- **Database**: Add `google_id` (unique) to the `users` table and makes `password_hash` nullable.
- **Backend Controller**: Implement `googleSignIn` to verify `idToken` or `code`, handle user onboarding, and link existing accounts by email.
- **Frontend Layout**: Add the Google Identity Services script to `app/layout.tsx`.
- **Login Page**: Add the Google Sign-In button and implement the `handleGoogleResponse` callback.

## 2. Google Calendar Integration

### Changes Required:
- **Backend Dependencies**: Install `googleapis`.
- **Database**: Create a `user_tokens` table to securely store `access_token`, `refresh_token`, and `expiry_date`.
- **Backend Service**: Implement `calendarService.ts` to manage authorized clients (including token refreshing) and schedule events.
- **Backend Routes**: Create `/api/calendar/schedule` to let employers create interview events.
- **Frontend Components**: Implement `ScheduleModal.tsx` for interview details (date, time, duration, location).
- **Applicants Page**: Add a "Schedule" button that opens the `ScheduleModal`.

## 3. Implementation Assets (Reference)

### Database Migrations:
- `database/migration_google_auth.sql`: Added `google_id` and updated `password_hash` constraint.
- `database/migration_user_tokens.sql`: Created the `user_tokens` table for OAuth credentials.

### Backend Infrastructure:
- `backend/src/controllers/googleAuth.ts`: Core logic for social login and token management.
- `backend/src/services/calendarService.ts`: Integration with Google Calendar API.
- `backend/src/routes/calendarRoutes.ts`: REST API for scheduling.

### Frontend UI:
- `frontend/components/ScheduleModal.tsx`: Modern, premium UI for interview scheduling.
- `frontend/app/login/page.tsx`: Updated login with standard Google button and enhanced Authorization Code flow for Calendar permissions.

## 4. Pending Features (Phase 3 Suggestions)
- **Google Drive Integration**: Allow candidates to import CVs directly from Google Drive.
- **Gmail API Integration**: Enable employers to send personalized emails from their own Gmail accounts.
