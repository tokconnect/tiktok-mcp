# MCP directory submission details

- **Name:** TikTok MCP by TokConnect
- **Repository:** https://github.com/tokconnect/tiktok-mcp
- **Website:** https://tokconnect.com
- **Documentation:** https://tokconnect.com/connect/
- **Remote endpoint:** https://mcp.tokconnect.com/mcp
- **Remote transport:** Streamable HTTP
- **Local transport:** stdio
- **Local install:** `npx -y github:tokconnect/tiktok-mcp#v1.0.0`
- **Local authentication:** `TOKCONNECT_API_KEY` environment variable
- **Remote authentication:** `Authorization: Bearer YOUR_TOKCONNECT_API_KEY`
- **Get a key:** https://app.tokconnect.com/
- **License:** MIT for the local connector; hosted service separate
- **Categories:** Social media, marketing, research, search analytics
- **Account required:** Yes
- **Pricing:** Eligible accounts receive 50 trial credits; paid plans available
- **Runtime:** Node.js 22+; optional Dockerfile

## Short description

Give your AI agent access to TikTok search demand, trends, videos, creators and comments. Run the open-source connector locally with a TokConnect API key, or connect directly over Streamable HTTP.

## Hosting disclosure

The package is a local connector to a hosted service. It does not contain a self-hosted TikTok data extraction backend. Tool execution and credit enforcement remain on TokConnect's servers. Tool schemas are discovered dynamically.

`server.json` describes the remote server using the MCP Registry schema. Registry publication and individual directory submissions are separate steps; do not mark them completed merely because this file exists. An npm package entry should be added only after a package is actually published to npm.
