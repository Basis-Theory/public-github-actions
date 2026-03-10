# slack-javascript-action

The shared Node.js library that provides the Slack messaging and notification logic used by `helper-slack-action` and `slack-message-action`. This is **not intended to be consumed directly** as a GitHub Action — it serves as the build output referenced by other actions in this repository.

## What it contains

- **Slack API client** (`slack.client.ts`) — Send and update messages via `chat.postMessage` / `chat.update`
- **Block Kit builders** (`useBlocks.ts`) — Constructs Slack Block Kit payloads for deploy notifications, approval requests, release notes, and draft release announcements
- **Configuration** (`useConfig.ts`) — Parses the GitHub context and action inputs into a typed config object
- **Deploy helpers** (`deploy.helpers.ts`) — Deploy start/done notifications with status-aware headings and release note threading
- **Approval helpers** (`approval.helpers.ts`) — Approval request/response flow using GitHub Actions artifacts to persist message IDs across jobs
- **Draft release helpers** (`draft_release_ready.helpers.ts`) — Draft release notifications with GitHub-to-Slack username mapping

## Build outputs

- `dist/deploy/index.js` — Used by `helper-slack-action`
- `dist/slack/index.js` — Used by `slack-message-action`

## GitHub-to-Slack user mapping

The action maintains a mapping of GitHub usernames to Slack user IDs in `useConfig.ts` (for deploy author mentions) and `useBlocks.ts` (for draft release collaborator mentions). To add a new team member, update both mappings.
