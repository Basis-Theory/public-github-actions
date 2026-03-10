# slack-message-action

A general-purpose Slack messaging action for sending, updating, or threading messages. Unlike the deploy-specific actions, this gives you full control over message content using Slack Block Kit or plain text.

## How it works

1. If `update-message-id` is provided, it updates the existing message with the new blocks/text
2. Otherwise, it sends a new message (optionally as a thread reply if `thread-message-id` is provided)
3. Returns the message ID (`ts`) as an output for chaining updates or threads

## Inputs

| Input | Required | Description |
|---|---|---|
| `slack-api-token` | Yes | Slack Bot API token |
| `channel` | Yes | Slack channel ID to send the message to |
| `blocks` | No | Slack Block Kit JSON payload |
| `text` | No | Plain text message content |
| `update-message-id` | No | Message ID to update (edits an existing message in place) |
| `thread-message-id` | No | Message ID to reply to (creates a threaded reply) |

## Outputs

| Output | Description |
|---|---|
| `message_id` | The Slack message timestamp ID of the sent/updated message |

## Usage

### Send a simple text message

```yaml
- name: Send message
  id: slack
  uses: Basis-Theory/public-github-actions/slack-message-action@master
  with:
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: C01234ABCDE
    text: "Build started for ${{ github.repository }}"
```

### Update an existing message

```yaml
- name: Send initial message
  id: slack
  uses: Basis-Theory/public-github-actions/slack-message-action@master
  with:
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: C01234ABCDE
    text: "Build in progress..."

# ... build steps ...

- name: Update message with result
  if: always()
  uses: Basis-Theory/public-github-actions/slack-message-action@master
  with:
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: C01234ABCDE
    update-message-id: ${{ steps.slack.outputs.message_id }}
    text: "Build finished: ${{ job.status }}"
```

### Thread a reply

```yaml
- name: Send parent message
  id: slack
  uses: Basis-Theory/public-github-actions/slack-message-action@master
  with:
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: C01234ABCDE
    text: "Deploy started"

- name: Add details in thread
  uses: Basis-Theory/public-github-actions/slack-message-action@master
  with:
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: C01234ABCDE
    thread-message-id: ${{ steps.slack.outputs.message_id }}
    text: "Deploying commit ${{ github.sha }}"
```

### Send Block Kit message

```yaml
- name: Send blocks
  uses: Basis-Theory/public-github-actions/slack-message-action@master
  with:
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: C01234ABCDE
    blocks: |
      [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Build Results*\nAll tests passed."
          }
        }
      ]
```
