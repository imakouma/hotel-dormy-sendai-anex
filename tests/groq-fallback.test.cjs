/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the TypeScript helper with Node's test runner. */
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
};
const { generateWithFallback, ChatUnavailableError } = require('../lib/chat-provider.ts');
const savedFetch = global.fetch;
const savedEnv = { ...process.env };
const keys = ['GROQ_API_KEY', 'OMNIROUTE_BASE_URL', 'OMNIROUTE_API_KEY', 'OMNIROUTE_MODEL', 'NODE_ENV'];
let calls, omniFailure, groqFailure;
const answer = text => Response.json({ choices: [{ message: { content: text } }] });
const limited = async () => { throw Object.assign(new Error('private upstream details'), { status: 429 }); };
beforeEach(() => {
  keys.forEach(key => delete process.env[key]);
  process.env.GROQ_API_KEY = 'groq-test-secret';
  process.env.NODE_ENV = 'production';
  calls = [];
  omniFailure = groqFailure = undefined;
  global.fetch = async (url, init) => {
    calls.push({ url: String(url), init, body: JSON.parse(init.body) });
    const failure = String(url).startsWith('https://api.groq.com/') ? groqFailure : omniFailure;
    if (failure instanceof Error) throw failure;
    return failure || answer(String(url).startsWith('https://api.groq.com/') ? 'Groq answer' : 'Omni answer');
  };
});
afterEach(() => {
  global.fetch = savedFetch;
  keys.forEach(key => savedEnv[key] === undefined ? delete process.env[key] : process.env[key] = savedEnv[key]);
});
function configureOmni() {
  process.env.OMNIROUTE_BASE_URL = 'https://gateway.example.test/v1';
  process.env.OMNIROUTE_API_KEY = 'omni-test-secret';
  process.env.OMNIROUTE_MODEL = 'hotel-guide-free';
}
for (const status of [402, 429]) {
  test(`Gemini ${status} reaches Groq when no gateway is available`, async () => {
    const prompt = 'Hotel A: checkout 11:00. Answer in English.';
    assert.equal(await generateWithFallback(prompt, async () => { throw { status }; }, 'en'), 'Groq answer');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(calls[0].body.model, 'openai/gpt-oss-120b');
    assert.equal(calls[0].body.messages[0].content, prompt);
    assert.equal(calls[0].body.max_tokens, 1024);
    assert.equal(calls[0].init.headers.Authorization, 'Bearer groq-test-secret');
    assert.equal(calls[0].init.redirect, 'error');
    assert.equal(calls[0].init.cache, 'no-store');
    assert.ok(calls[0].init.signal instanceof AbortSignal);
  });
}
test('Gemini recovery takes priority over both fallbacks', async () => {
  configureOmni();
  assert.equal(await generateWithFallback('hotel', async () => 'Gemini', 'en'), 'Gemini');
  assert.equal(calls.length, 0);
});
test('OmniRoute remains first fallback when configured', async () => {
  configureOmni();
  assert.equal(await generateWithFallback('hotel', limited, 'en'), 'Omni answer');
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /gateway.example.test/);
});
for (const kind of ['network', 'timeout', '503', '429']) {
  test(`OmniRoute ${kind} failure uses Groq without forwarding the gateway key`, async () => {
    configureOmni();
    omniFailure = kind === 'network' ? new Error('private network details') : kind === 'timeout' ? new DOMException('timeout', 'TimeoutError') : new Response('', { status: Number(kind) });
    assert.equal(await generateWithFallback('hotel', limited, 'en'), 'Groq answer');
    assert.equal(calls.length, 2);
    assert.equal(calls[1].init.headers.Authorization, 'Bearer groq-test-secret');
    assert.doesNotMatch(JSON.stringify(calls[1]), /omni-test-secret/);
  });
}
for (const response of [new Response('', { status: 403 }), Response.json({ choices: [{ message: { content: null }, finish_reason: 'content_filter' }] })]) {
  test('gateway refusal does not bypass safety through Groq', async () => {
    configureOmni();
    omniFailure = response;
    await assert.rejects(generateWithFallback('hotel', limited, 'en'), ChatUnavailableError);
    assert.equal(calls.length, 1);
  });
}
for (const status of [400, 401, 403, 500]) {
  test(`Gemini ${status} never calls Groq`, async () => {
    const failure = Object.assign(new Error('Gemini error'), { status });
    await assert.rejects(generateWithFallback('hotel', async () => { throw failure; }, 'en'), e => e === failure);
    assert.equal(calls.length, 0);
  });
}
for (const failure of [new Response('upstream-secret', { status: 429 }), new Error('upstream-secret'), Response.json({}), answer(' ')]) {
  test('Groq failures are bounded and return translated safe guidance', async () => {
    groqFailure = failure;
    await assert.rejects(generateWithFallback('hotel', limited, 'en'), e => e instanceof ChatUnavailableError && /front desk/.test(e.message) && !/secret/.test(e.message));
    assert.equal(calls.length, 1);
  });
}
