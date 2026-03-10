# Basis Theory Public GitHub Actions

A collection of reusable GitHub Actions maintained by [Basis Theory](https://basistheory.com) for deployment notifications, Slack messaging, CI cache management, and runner utilities.

## Available Actions

| Action | Description | Docs |
|---|---|---|
| [deploy-slack-action](./deploy-slack-action) | High-level composite for deploy lifecycle notifications | [docs](./docs/deploy-slack-action/index.md) |
| [draft-release-slack-action](./draft-release-slack-action) | Notify Slack when a draft release is created | [docs](./docs/draft-release-slack-action/index.md) |
| [helper-slack-action](./helper-slack-action) | Core Node.js engine for all deploy/release Slack notifications | [docs](./docs/helper-slack-action/index.md) |
| [public-ip](./public-ip) | Get the GitHub Actions runner's public IPv4 address | [docs](./docs/public-ip/index.md) |
| [slack-javascript-action](./slack-javascript-action) | Shared JS library used by the Slack actions (not consumed directly) | [docs](./docs/slack-javascript-action/index.md) |
| [slack-message-action](./slack-message-action) | General-purpose send, update, and thread Slack messages | [docs](./docs/slack-message-action/index.md) |

See the [`docs/`](./docs) directory for detailed documentation, inputs/outputs, and usage examples for each action.

## Quick Start

### Deploy Notifications

```yaml
name: Product Deploy

on:
  release:
    branches: [master]
    types: [released]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Notify deploy start
        uses: Basis-Theory/public-github-actions/deploy-slack-action@master
        with:
          slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
          channel: ${{ vars.DEPLOY_CHANNEL }}

      # ... deploy steps ...

      - name: Notify deploy done
        if: always()
        uses: Basis-Theory/public-github-actions/deploy-slack-action@master
        with:
          slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
          channel: ${{ vars.DEPLOY_CHANNEL }}
          status: done
```

### Slack Messaging

```yaml
- name: Send a message
  id: slack
  uses: Basis-Theory/public-github-actions/slack-message-action@master
  with:
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: ${{ vars.CHANNEL }}
    text: "Build started for ${{ github.repository }}"

- name: Update the message
  uses: Basis-Theory/public-github-actions/slack-message-action@master
  with:
    slack-api-token: ${{ secrets.SLACK_API_TOKEN }}
    channel: ${{ vars.CHANNEL }}
    update-message-id: ${{ steps.slack.outputs.message_id }}
    text: "Build finished: ${{ job.status }}"
```

### Public IP

```yaml
- name: Get runner IP
  id: runner-ip
  uses: Basis-Theory/public-github-actions/public-ip@master

- run: echo "${{ steps.runner-ip.outputs.ipv4 }}"
```

## Repository Structure

```
.
├── deploy-slack-action/    # Deploy notification composite action
├── draft-release-slack-action/ # Draft release notification composite action
├── helper-slack-action/    # Core Slack notification action (Node.js)
├── public-ip/              # Runner public IP composite action
├── slack-javascript-action/ # Shared JS source & build output
├── slack-message-action/   # General-purpose Slack messaging action
└── docs/                   # Detailed documentation for each action
```

## License

See [LICENSE](./LICENSE) for details.
