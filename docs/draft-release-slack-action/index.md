# draft-release-slack-action

Sends a Slack notification when a draft release is created. It posts a message with the package name, version, contributing authors (mapped from GitHub usernames to Slack IDs), and a button linking to the release edit page.

## How it works

1. Captures the current job status
2. Delegates to `helper-slack-action` with `type: "draft-release-ready"`
3. The notification includes collaborator mentions resolved from the release notes' `@username` references

## Inputs

| Input | Required | Description |
|---|---|---|
| `slack-api-token` | Yes | Slack Bot API token |
| `channel` | Yes | Slack channel ID to send the message to |
| `mention-person` | No | Slack user to mention in the notification |

## Usage

```yaml
name: Draft Release Notification
on:
  release:
    types: [created]

jobs:
  notify:
    if: github.event.release.draft
    runs-on: ubuntu-latest
    steps:
      - uses: Basis-Theory/public-github-actions/draft-release-slack-action@master
        with:
          slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
          channel: C01234ABCDE
```
