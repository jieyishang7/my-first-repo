# Project 06 — Love After Dark

Love After Dark is a nightclub-inspired interface for Studio Critic, a role-specific chatbot for architecture and computational-design students. It
helps a student articulate design intent, examine a decision in context, and choose a useful next
iteration. It does not produce a project on the student's behalf or replace an instructor or
licensed professional.

The browser signs users in anonymously, listens to their private Firestore message collection,
and calls a Firebase callable function. The function owns the OpenAI request, so the OpenAI API
key is never shipped to the browser.

## 1. Prerequisites

- Node.js 20
- A Firebase project on the Blaze plan (outbound network calls from Cloud Functions require it)
- Firebase CLI: `npm install -g firebase-tools`
- An OpenAI Platform account with API billing enabled

ChatGPT subscriptions and API billing are separate. Create an API key at
<https://platform.openai.com/api-keys> and keep it out of this repository.

## 2. Connect Firebase

1. Run `firebase login` and `firebase use --add` from this directory.
2. In Firebase Console, create a Firestore database.
3. In **Authentication > Sign-in method**, enable **Anonymous**.
4. In **Project settings > Your apps**, register a Web app.
5. Copy its configuration values into `public/firebase-config.js`.
6. Install function dependencies with `npm --prefix functions install`.

Firebase web configuration is not a server secret. Database access is protected by
`firestore.rules`; only callable server functions can write or delete chat messages, and each
signed-in user can only read their own messages.

## 3. Store the OpenAI key securely

Run:

```bash
firebase functions:secrets:set OPENAI_API_KEY
```

Paste the key only when the CLI prompts. The function reads it through Firebase Secret Manager.
Never put an OpenAI key in `public/`, source control, or browser JavaScript.

## 4. Run and deploy

Validate the server code:

```bash
npm --prefix functions run lint
```

Deploy Firestore rules, the function, and Hosting:

```bash
firebase deploy --only firestore:rules,functions,hosting
```

The CLI prints the Firebase Hosting URL after a successful deploy. Open it, confirm that the
header reads **Firebase online**, send a message, and verify the two message documents under
`users/{anonymous-user-id}/messages` in Firestore.

## Local emulators

Create `functions/.secret.local` containing `OPENAI_API_KEY=...` (it is ignored by Git), then run:

```bash
firebase emulators:start
```

The production browser configuration still needs to identify the Firebase project. To route the
browser SDKs to local emulators, add the Firebase SDK `connect*Emulator` calls in `public/app.js`;
the hosted deployment requires no such change.

## Security and cost controls

- OpenAI requests originate only in an authenticated Cloud Function.
- Firestore denies all client writes and cross-user reads.
- The function validates input and allows six requests per user per minute.
- `safety_identifier` is a stable Firebase UID, as recommended for end-user applications.
- The default model is `gpt-5.6-terra`, selected to balance response quality and assignment cost.
- For a public launch, enable Firebase App Check, add a daily project budget alert, and replace
  anonymous authentication if conversations must follow people across devices.
