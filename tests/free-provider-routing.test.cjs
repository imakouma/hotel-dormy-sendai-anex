/* eslint-disable @typescript-eslint/no-require-imports -- Test the real TypeScript helper. */
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { generateWithFallback, ChatUnavailableError } = require('../lib/chat-provider.ts');
const originalFetch = global.fetch;
const env = { ...process.env };
let calls, replies;
const ok = text => Response.json({ choices: [{ message: { content: text } }] });
const limited = async () => { throw { status: 429 }; };
beforeEach(() => {
  process.env.GROQ_API_KEY = 'synthetic-groq-key';
  delete process.env.OMNIROUTE_MODEL;
  calls = [];
  replies = [];
  global.fetch = async (url, init) => {
    calls.push({ url: String(url), init, body: JSON.parse(init.body) });
    const next = replies.shift();
    if (next instanceof Error) throw next;
    assert.ok(next, 'unexpected additional request');
    return next;
  };
});
afterEach(() => {
  global.fetch = originalFetch;
  for (const key of ['GROQ_API_KEY', 'OMNIROUTE_MODEL', 'OMNIROUTE_BASE_URL', 'OMNIROUTE_API_KEY']) {
    if (env[key] === undefined) delete process.env[key]; else process.env[key] = env[key];
  }
});
for (const status of [402, 429]) {
  test(`120B ${status} uses 20B once with the identical prompt and existing key`, async () => {
    replies = [new Response('', { status }), ok('backup')];
    assert.equal(await generateWithFallback('Hotel A, answer in English', limited, 'en'), 'backup');
    assert.deepEqual(calls.map(c => c.body.model), ['openai/gpt-oss-120b', 'openai/gpt-oss-20b']);
    assert.deepEqual(calls[0].body.messages, calls[1].body.messages);
    assert.equal(calls[1].url, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(calls[1].init.headers.Authorization, 'Bearer synthetic-groq-key');
    assert.equal(calls[1].init.redirect, 'error');
    assert.equal(calls[1].init.cache, 'no-store');
  });
}
for (const status of [400, 401, 403, 500, 503]) {
  test(`120B ${status} does not bypass the error with 20B`, async () => {
    replies = [new Response('', { status })];
    await assert.rejects(generateWithFallback('hotel', limited, 'en'), ChatUnavailableError);
    assert.equal(calls.length, 1);
  });
}
for (const first of [new DOMException('timeout', 'TimeoutError'), ok(''), Response.json({ choices: [{ message: { refusal: 'refused', content: 'no' } }] }), Response.json({ choices: [{ message: { content: 'no' }, finish_reason: 'content_filter' }] })]) {
  test('timeout, empty answer and refusal stop without 20B', async () => {
    replies = [first];
    await assert.rejects(generateWithFallback('hotel', limited, 'en'), ChatUnavailableError);
    assert.equal(calls.length, 1);
  });
}
test('gateway outage and both model limits end after three requests', async () => {
  process.env.OMNIROUTE_BASE_URL = 'https://gateway.example.test/v1';
  process.env.OMNIROUTE_API_KEY = 'synthetic-gateway-key';
  process.env.OMNIROUTE_MODEL = 'hotel-guide-free';
  replies = [new Response('', { status: 503 }), new Response('', { status: 429 }), new Response('', { status: 429 })];
  await assert.rejects(generateWithFallback('hotel', limited, 'en'), e => e instanceof ChatUnavailableError && /front desk/.test(e.message));
  assert.equal(calls.length, 3);
  assert.ok(calls.slice(1).every(c => c.init.headers.Authorization === 'Bearer synthetic-groq-key'));
});
test('successful 120B does not use 20B', async () => {
  replies = [ok('primary')];
  assert.equal(await generateWithFallback('hotel', limited, 'en'), 'primary');
  assert.equal(calls.length, 1);
});
