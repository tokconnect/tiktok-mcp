import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js';
import {readToken, restrictedFetch, createConnector, ENDPOINT} from './connector.js';

test('API key required; control characters rejected',()=>{
 for(const token of [undefined,'','a\nb','a b'])assert.throws(()=>readToken({TOKCONNECT_API_KEY:token}));
 assert.equal(readToken({TOKCONNECT_API_KEY:' test-key '}),'test-key');
});
test('credentials cannot follow redirects or go to another destination',async()=>{
 let seen;const run=restrictedFetch(async(input,init)=>{seen=init;return new Response('ok')});
 await run(ENDPOINT,{redirect:'follow'});assert.equal(seen.redirect,'error');
 for(const url of ['http://mcp.tokconnect.com/mcp','https://evil.example/mcp',ENDPOINT+'?redirect=evil','https://mcp.tokconnect.com/api'])assert.throws(()=>run(url));
});
test('real MCP client sees tools, arguments, paging and structured credit errors',async()=>{
 let count=0,params;
 const exhausted={isError:true,content:[{type:'text',text:'Upgrade: https://app.tokconnect.com/#billing'}],structuredContent:{code:'credits_exhausted',upgradeUrl:'https://app.tokconnect.com/#billing'}};
 const server=createConnector({listTools:async p=>({tools:[{name:'search_topics',description:'Search topics',inputSchema:{type:'object',properties:{keyword:{type:'string'}}}}],nextCursor:p?.cursor?'last':'next'}),callTool:async p=>{count++;params=p;return exhausted}});
 const client=new Client({name:'test',version:'1'});const [a,b]=InMemoryTransport.createLinkedPair();
 try {await server.connect(a);await client.connect(b);assert.equal((await client.listTools({cursor:'page2'})).nextCursor,'last');
 const result=await client.callTool({name:'search_topics',arguments:{keyword:'coffee'}});assert.equal(result.isError,true);assert.deepEqual(result.structuredContent,exhausted.structuredContent);assert.equal(count,1);assert.deepEqual(params.arguments,{keyword:'coffee'});
 }finally{await client.close();await server.close()}
});
test('failure never leaks upstream secrets or retries a call',async()=>{
 let calls=0;const server=createConnector({listTools:async()=>({tools:[]}),callTool:async()=>{calls++;throw Error('secret-test-token')}});
 const client=new Client({name:'test',version:'1'});const [a,b]=InMemoryTransport.createLinkedPair();
 try{await server.connect(a);await client.connect(b);const r=await client.callTool({name:'search_topics'});assert.equal(calls,1);assert.equal(r.isError,true);assert.ok(!JSON.stringify(r).includes('secret-test-token'))}finally{await client.close();await server.close()}
});
test('CLI fails cleanly without credentials, stdout remains protocol-only',()=>{
 const result=spawnSync(process.execPath,['cli.js'],{env:{...process.env,TOKCONNECT_API_KEY:''},encoding:'utf8'});
 assert.equal(result.status,1);assert.equal(result.stdout,'');assert.match(result.stderr,/Set TOKCONNECT_API_KEY/);
});
