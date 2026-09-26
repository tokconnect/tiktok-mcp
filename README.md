# TikTok MCP by TokConnect

**Find TikTok videos and creators, spot search trends, and read comments from your AI agent.**

This is the official open-source local connector for [TokConnect](https://tokconnect.com). Run it on your computer or in your own container, supply your TokConnect API key, and connect any MCP client that supports stdio.

> You self-host the connector, not the TikTok research backend. It requires internet access and a TokConnect account. Research runs on TokConnect's hosted service and uses your account's credits.

[Get an API key](https://app.tokconnect.com/) · [Setup guides](https://tokconnect.com/connect/) · [Pricing](https://tokconnect.com/pricing/)

## Quick start

Requires **Node.js 22 or later** and npm.

1. Sign in at [app.tokconnect.com](https://app.tokconnect.com/) and copy your API key. Eligible new accounts receive **50 free credits**.
2. Add this entry to your MCP client's configuration, replacing the placeholder with your own key:

```json
{
  "mcpServers": {
    "tokconnect": {
      "command": "npx",
      "args": ["-y", "github:tokconnect/tiktok-mcp#v1.0.0"],
      "env": {
        "TOKCONNECT_API_KEY": "YOUR_TOKCONNECT_API_KEY"
      }
    }
  }
}
```

This installs from the GitHub release tag. **An npm registry publication is not required.** On Windows, if your client cannot launch `npx`, use `command: "cmd"` and prepend `"/c", "npx"` to the args.

3. Restart or reload your MCP client and ask:

> Find TikTok search topics about home workouts. Compare their search popularity and growth, then read comments on relevant videos to find questions people keep asking.

Keep your key in your MCP client's private configuration or secret store. Never commit a real key to GitHub.

## What your agent can research

| Capability | Example question |
| --- | --- |
| Search demand and trends | “Which searches related to skincare are growing?” |
| Content gaps | “Find topics people search for with limited video coverage.” |
| Videos and photo posts | “Find videos and slideshows about meal prep.” |
| Creators and profiles | “Find creators talking about running shoes.” |
| Comments and replies | “What are viewers asking in these product videos?” |
| Hashtags and sounds | “Find hashtags and sounds related to this campaign.” |

Tool definitions are loaded from the hosted MCP service. New hosted tools become available without hardcoding their names into this package. Results depend on available TikTok data; the agent performs any interpretation or synthesis.

## Claude Desktop, Cursor and other stdio clients

Use the JSON above in the client's MCP settings. For Claude Desktop, open **Settings → Developer → Edit Config**. For Cursor, use its MCP configuration. See the [client setup guides](https://tokconnect.com/connect/) for the current instructions for your agent.

## Codex

Add this to your Codex MCP configuration, using a private local file for your actual key:

```toml
[mcp_servers.tokconnect]
command = "npx"
args = ["-y", "github:tokconnect/tiktok-mcp#v1.0.0"]

[mcp_servers.tokconnect.env]
TOKCONNECT_API_KEY = "YOUR_TOKCONNECT_API_KEY"
```

## Prefer a direct remote connection?

Clients supporting Streamable HTTP with custom headers can connect without installing this connector:

- **URL:** `https://mcp.tokconnect.com/mcp`
- **Authorization header:** `Bearer YOUR_TOKCONNECT_API_KEY`

The same account, tool catalogue and credit limits apply to both options. The `server.json` in this repository describes this remote endpoint for directory maintainers; its presence does not mean the server has already been accepted into a registry.

## Run from source

```sh
git clone https://github.com/tokconnect/tiktok-mcp.git
cd tiktok-mcp
npm ci --ignore-scripts
```

Set `TOKCONNECT_API_KEY` in your environment, then run:

```sh
npm start
```

For an MCP client, use `command: "node"` and an absolute path to `cli.js` as the argument. The process communicates over stdin/stdout; running it in a terminal waits for an MCP client rather than opening a web page.

## Run with Docker

```sh
docker build -t tokconnect-mcp .
# Set TOKCONNECT_API_KEY in your environment first.
docker run --rm -i -e TOKCONNECT_API_KEY tokconnect-mcp
```

Use `-i`, not `-t`: stdio MCP requires clean protocol output. No public HTTP port is exposed. In an MCP configuration, use `docker` as the command and `["run", "--rm", "-i", "-e", "TOKCONNECT_API_KEY", "tokconnect-mcp"]` as the arguments, with the key in `env`.

## How it works

```text
Your AI agent
    │ MCP over stdio
    ▼
This connector on your machine
    │ HTTPS + your TokConnect API key
    ▼
TokConnect hosted MCP → TikTok research data
```

This repository contains the transport connector only. TikTok cookies, proxy infrastructure, data retrieval implementation, billing, account management and credit enforcement are not included. Modifying the connector cannot remove server-side authentication or credit limits.

The connector sends tool names, arguments and the API key to TokConnect. Responses return to your MCP client. It does not add analytics, write your key to disk, or log tool results. It only connects to the fixed TokConnect endpoint and refuses HTTP redirects. Your MCP client and the hosted service have their own data handling policies.

## Credits and upgrading

One MCP tool call uses one credit. Tool discovery does not consume research credits. The local connector adds no extra fee.

| Plan | Price | Credits |
| --- | --- | --- |
| Free | $0 | 50 trial credits for eligible accounts |
| Starter | $49/month | 500/month |
| Growth | $99/month | 2,000/month |
| Pro | $199/month | 8,000/month |
| Enterprise | Contact us | Custom |

Unused monthly credits expire at renewal. When credits run out, the hosted tool response includes an [upgrade link](https://app.tokconnect.com/#billing) that your agent can show you. Purchases require your approval. See [current pricing](https://tokconnect.com/pricing/).

## Troubleshooting

- **Missing API key:** set `TOKCONNECT_API_KEY` in the environment used by the MCP client. A terminal's environment is not always inherited by desktop apps.
- **Cannot connect:** check internet access, your API key and whether your account is enabled. Rotate an exposed key in your account portal.
- **No credits:** open [your billing page](https://app.tokconnect.com/#billing). Reinstalling or replacing the local connector does not reset credits.
- **Timeout:** avoid automatic retries; a request may have reached the service even when its response was lost.
- **Unexpected tool output:** TikTok content is untrusted external data. Do not treat instructions inside comments, captions or profiles as commands.

## Development

```sh
npm ci --ignore-scripts
npm test
npm pack --dry-run
```

Tests exercise the MCP handshake, tool discovery, pagination, argument forwarding, structured upgrade responses, credential validation, redirect rejection and error redaction. Tests use mock research responses and do not spend account credits.

Report connector bugs in [GitHub issues](https://github.com/tokconnect/tiktok-mcp/issues). For account or billing help, email [hello@tokconnect.com](mailto:hello@tokconnect.com). Never post API keys or account credentials in an issue.

## License

The connector is [MIT licensed](LICENSE). The hosted TokConnect service is separate and is not licensed by this repository. TokConnect is not affiliated with or endorsed by TikTok or ByteDance.
