# public-ip

Retrieves the public IPv4 address of the GitHub Actions runner by calling `https://checkip.amazonaws.com`. Useful for temporarily allowlisting the runner's IP in firewalls or security groups before accessing protected resources.

## Inputs

This action has no inputs.

## Outputs

| Output | Description |
|---|---|
| `ipv4` | The public IPv4 address of the GitHub Actions runner |

## Usage

### Get runner IP and allowlist in AWS

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Get runner IP
        id: runner-ip
        uses: Basis-Theory/public-github-actions/public-ip@master

      - name: Allowlist IP in security group
        run: |
          aws ec2 authorize-security-group-ingress \
            --group-id sg-xxxxx \
            --protocol tcp --port 5432 \
            --cidr ${{ steps.runner-ip.outputs.ipv4 }}/32

      # ... do work against the protected resource ...

      - name: Remove IP from security group
        if: always()
        run: |
          aws ec2 revoke-security-group-ingress \
            --group-id sg-xxxxx \
            --protocol tcp --port 5432 \
            --cidr ${{ steps.runner-ip.outputs.ipv4 }}/32
```

### Use the IP in other steps

```yaml
- name: Get runner IP
  id: runner-ip
  uses: Basis-Theory/public-github-actions/public-ip@master

- name: Print IP
  run: echo "Runner IP is ${{ steps.runner-ip.outputs.ipv4 }}"
```
