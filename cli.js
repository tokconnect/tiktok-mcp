#!/usr/bin/env node
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {readToken, connectRemote, createConnector, VERSION} from './connector.js';

if (process.argv.includes('--help')) {
  process.stdout.write('TokConnect TikTok MCP connector\n\nSet TOKCONNECT_API_KEY, then run tokconnect-mcp.\nTransport: stdio → https://mcp.tokconnect.com/mcp\nGet a key: https://app.tokconnect.com/\n');
} else if (process.argv.includes('--version')) {
  process.stdout.write(VERSION + '\n');
} else {
  let remote, local, closing = false;
  const close = async () => {
    if (closing) return;
    closing = true;
    const deadline = setTimeout(() => process.exit(0), 2000);
    deadline.unref();
    await Promise.allSettled([local?.close(), remote?.close()]);
  };
  process.once('SIGINT', close);
  process.once('SIGTERM', close);
  try {
    remote = await connectRemote(readToken());
    local = createConnector(remote);
    local.onclose = close;
    await local.connect(new StdioServerTransport());
  } catch (error) {
    // Only our static messages are printed; SDK/network payloads can contain secrets.
    process.stderr.write('TokConnect: ' + (error.message.startsWith('Set TOKCONNECT_API_KEY') || error.message.startsWith('Could not connect to TokConnect') ? error.message : 'Connector failed to start.') + '\n');
    await close();
    process.exitCode = 1;
  }
}
