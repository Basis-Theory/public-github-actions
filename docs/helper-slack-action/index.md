# helper-slack-action

The core Node.js-based Slack notification engine that powers both `deploy-slack-action` and `draft-release-slack-action`. It handles the full deploy notification lifecycle including approval flows, release notes threading, and status updates.

## How it works

The action routes to different behaviors based on the `type` and `status` inputs:

- **`type: deploy` + `status: start`** — Posts a "Deploy Started" message with repo, version, author, and timestamps. Threads release notes beneath it. If an approval artifact exists, updates it.
- **`type: deploy` + `status: request`** — Posts an "Approval Requested" message mentioning the specified person, threads release notes, and uploads an artifact so the approval message can be updated later.
- **`type: deploy` + `status: done/success/failure/cancelled`** — Updates the original "Deploy Started" message (via `SLACK_MESSAGE_ID` env var) to reflect final status. On failure, threads a mention (either the deploy author's Slack ID or a user group fallback). On cancellation, marks the approval request as cancelled.
- **`type: draft-release-ready`** — Posts a draft release notification with collaborator mentions (GitHub-to-Slack user mapping).

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `slack-api-token` | Yes | | Slack Bot API token |
| `github` | Yes | | `${{ toJSON(github) }}` — the full GitHub context |
| `channel` | Yes | | Slack channel ID to send the message to |
| `mention-person` | No | | Slack user to mention for approvals |
| `status` | No | `start` | `start`, `done`, `request`, `success`, `failure`, `cancelled` |
| `type` | No | `deploy` | `deploy` or `draft-release-ready` |

## Outputs

| Output | Description |
|---|---|
| `message_id` | The Slack message timestamp ID of the sent message |

## Usage

### Deploy notification

```yaml
- uses: Basis-Theory/public-github-actions/helper-slack-action@master
  with:
    github: ${{ toJSON(github) }}
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: C01234ABCDE
    status: start
```

### Approval request with mention

```yaml
- uses: Basis-Theory/public-github-actions/helper-slack-action@master
  with:
    github: ${{ toJSON(github) }}
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: C01234ABCDE
    status: request
    mention-person: "@U01PT4W3RM5"
```

### Draft release notification

```yaml
- uses: Basis-Theory/public-github-actions/helper-slack-action@master
  with:
    github: ${{ toJSON(github) }}
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: C01234ABCDE
    type: draft-release-ready
```

> **Note:** In most cases you should use `deploy-slack-action` or `draft-release-slack-action` instead of calling this action directly, as they handle passing the GitHub context automatically.
