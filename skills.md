# SwipeMail – Integrate Real Gmail Inbox

We have completed Google OAuth login using Supabase. Now implement actual Gmail integration.

## Main objective

When a user logs into SwipeMail using Google, fetch the emails from that same Google account and display them in the existing swipeable email-card interface.

Do not use mock emails. Do not redesign the UI. Connect real Gmail data to the existing design.

## 1. Google OAuth permission

Inspect the existing Supabase Google authentication implementation.

Update the Google OAuth request to request this scope:

`https://www.googleapis.com/auth/gmail.modify`

Use the appropriate OAuth parameters:

- `access_type: offline`
- `prompt: consent` when initially requesting Gmail authorization and obtaining a refresh token.

Keep the existing Supabase authentication flow working.

The user must explicitly grant Gmail access. Do not assume that signing in automatically grants Gmail permissions.

## 2. Secure Google token handling

After successful OAuth:

- Retrieve the Google provider access token.
- Retrieve the Google provider refresh token when provided.
- Associate the Google tokens with the authenticated Supabase user.
- Store tokens securely on the server side.
- Encrypt sensitive tokens at rest.
- Never expose refresh tokens in frontend code.
- Never store Google access or refresh tokens in localStorage.
- Never expose Google Client Secret in frontend code.
- Ensure one user's tokens can never be accessed by another user.

Use the existing backend architecture. If needed, implement Supabase Edge Functions and a secure database structure with appropriate Row Level Security policies.

Implement token refresh on the server when the Google access token expires.

Do not assume Supabase automatically refreshes Google provider tokens.

## 3. Fetch real Gmail messages

Use the Gmail API:

`GET https://gmail.googleapis.com/gmail/v1/users/me/messages`

Fetch the user's inbox messages.

Initially fetch the latest 20 messages.

For each message, retrieve the necessary details:

- Sender name
- Sender email address
- Subject
- Email date
- Email snippet / preview
- Read or unread status
- Important status
- Message ID
- Thread ID
- Labels

Use Gmail API message details to retrieve the actual message metadata.

Handle pagination so that additional emails can be loaded when needed.

## 4. Connect Gmail data to existing cards

Replace the existing mock email data with real Gmail messages.

Map the Gmail response into the existing email-card data structure.

Preserve the current SwipeMail design:

- Sender logo or avatar
- Sender name
- Sender email
- Subject
- Date
- Email preview
- Existing action buttons
- Existing swipe animations
- Directional swipe border effects

If a sender logo is unavailable, show a circular avatar with the sender's initial.

Do not change the existing swipe gesture behavior.

## 5. Loading and error states

Add proper states:

- Connecting to Gmail
- Fetching inbox
- Emails successfully loaded
- No emails found
- Gmail permission denied
- Access token expired
- Gmail API error
- Network error

Show a clean loading indicator while fetching messages.

If the user has not granted Gmail permission, show a Connect Gmail action.

## 6. Account handling

Use the Google account that the user actually authenticated with.

Display the connected Gmail address somewhere accessible in the app, such as the account menu.

Do not accidentally fetch emails from a different Google account.

Provide a disconnect option that revokes or removes the stored Gmail credentials securely.

## 7. Development requirements

Before coding, inspect:

- Existing Supabase client configuration
- Google login implementation
- OAuth callback handling
- Existing database tables
- Existing email card components
- Existing mock email data
- Current Vercel deployment setup

Reuse existing components and architecture.

Do not create duplicate authentication flows unnecessarily.

Do not break existing login, theme switching, folder navigation, or swipe functionality.

Implement this incrementally. First complete OAuth permission and secure token handling. Then fetch Gmail messages. Finally connect them to the existing cards.

After implementation, explain what configuration or deployment steps I need to perform manually.

**Success condition:** I log into SwipeMail with my Gmail account, grant Gmail permission, and see my actual inbox emails displayed as swipeable cards.