# deploy-slack-action

A composite action that sends deployment lifecycle notifications to Slack. It wraps `helper-slack-action` and supports statuses: `start`, `done`, `request`, `success`, `cancelled`, `failure`.

## How it works

1. Resolves the job status from the `job-status` input or falls back to `job.status`
2. Delegates to `helper-slack-action` with the full GitHub context, Slack token, channel, and status

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `slack-api-token` | Yes | | Slack Bot API token |
| `channel` | Yes | | Slack channel ID to send the message to |
| `mention-person` | No | | Slack user to mention in the notification |
| `status` | No | `start` | Deploy status: `start`, `done`, `request`, `success`, `cancelled`, `failure` |
| `job-status` | No | | Overrides `job.status` for the final notification |

## Usage

### Basic deploy lifecycle

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Notify deploy start
        uses: Basis-Theory/public-github-actions/deploy-slack-action@master
        with:
          slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
          channel: C01234ABCDE
          status: start

      # ... deploy steps ...

      - name: Notify deploy done
        if: always()
        uses: Basis-Theory/public-github-actions/deploy-slack-action@master
        with:
          slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
          channel: C01234ABCDE
          status: done
```

### With approval request and mention

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Request approval
        uses: Basis-Theory/public-github-actions/deploy-slack-action@master
        with:
          slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
          channel: C01234ABCDE
          status: request
          mention-person: "@U01PT4W3RM5"
```
