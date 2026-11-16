/* eslint-disable @typescript-eslint/no-require-imports -- Node test runner loads the Next route through the installed TS compiler. */
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

// Run the real route and installed SDKs; only external HTTP is replaced.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  module._compile(outputText, filename);
};
const { POST } = require('../app/api/chat/route.ts');
const originalFetch = global.fetch;
const originalEnv = { ...process.env };
let geminiStatus, omniStatus, omniBody, calls, geminiBody, omniFailure;
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json' },
});
beforeEach(() => {
  process.env.GEMINI_API_KEY = 'gemini-test-secret';
  delete process.env.GEMINI_MODEL;
  delete process.env.GROQ_API_KEY;
  process.env.OMNIROUTE_BASE_URL = 'https://gateway.example.test/v1';
  process.env.OMNIROUTE_API_KEY = 'omni-test-secret';
  process.env.OMNIROUTE_MODEL = 'hotel-guide-free';
  process.env.NODE_ENV = 'production';
  geminiStatus = 200;
  omniStatus = 200;
  omniFailure = false;
  geminiBody = { candidates: [{ content: { role: 'model', parts: [{ text: 'Gemini reply' }] }, finishReason: 'STOP' }] };
  omniBody = { choices: [{ message: { content: 'Omni reply' }, finish_reason: 'stop' }] };
  calls = [];
  global.fetch = async (input, init) => {
    const url = String(input);
    if (url.includes('generativelanguage.googleapis.com')) {
      calls.push({ provider: 'gemini', url, body: JSON.parse(init.body) });
      return json(geminiStatus === 200 ? geminiBody : {
        error: { code: geminiStatus, message: 'upstream-secret-must-not-leak', status: 'RESOURCE_EXHAUSTED' },
      }, geminiStatus);
    }
    if (url.includes('/chat/completions')) {
      calls.push({ provider: 'omni', url, body: JSON.parse(init.body), init });
      if (omniFailure) throw new Error('upstream-secret-must-not-leak');
      return json(omniBody, omniStatus);
    }
    return new Response('<p>Official hotel information</p>');
  };
});
afterEach(() => {
  global.fetch = originalFetch;
  for (const key of ['GROQ_API_KEY', 'GEMINI_API_KEY', 'GEMINI_MODEL', 'OMNIROUTE_BASE_URL', 'OMNIROUTE_API_KEY', 'OMNIROUTE_MODEL', 'NODE_ENV']) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});
function request(body = { message: '朝食について', language: 'en' }) {
  return POST(new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify(body) }));
}

test('Gemini answers without contacting OmniRoute', async () => {
  const res = await request();
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { reply: 'Gemini reply' });
  assert.deepEqual(calls.map(c => c.provider), ['gemini']);
  assert.match(calls[0].url, /gemini-3\.5-flash-lite/);
});
test('an explicit Gemini model overrides the default', async () => {
  process.env.GEMINI_MODEL = 'gemini-custom-model';
  assert.equal((await request()).status, 200);
  assert.match(calls[0].url, /gemini-custom-model/);
});
for (const status of [402, 429]) {
  test(`Gemini ${status} falls back once with the same hotel context and language`, async () => {
    geminiStatus = status;
    const res = await request();
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { reply: 'Omni reply' });
    assert.deepEqual(calls.map(c => c.provider), ['gemini', 'omni']);
    const [gemini, omni] = calls;
    assert.equal(omni.body.messages[0].content, gemini.body.contents[0].parts[0].text);
    assert.match(omni.body.messages[0].content, /English/);
    assert.match(omni.body.messages[0].content, /朝食について/);
    assert.equal(omni.body.model, 'hotel-guide-free');
    assert.equal(omni.body.stream, false);
    assert.equal(omni.init.headers.Authorization, 'Bearer omni-test-secret');
    assert.equal(omni.init.redirect, 'error');
    assert.ok(omni.init.signal instanceof AbortSignal);
    assert.doesNotMatch(JSON.stringify(omni.body), /gemini-test-secret/);
  });
}
test('the next request tries Gemini again after quota recovery', async () => {
  geminiStatus = 429;
  assert.equal((await request()).status, 200);
  geminiStatus = 200;
  assert.deepEqual(await (await request()).json(), { reply: 'Gemini reply' });
  assert.deepEqual(calls.map(c => c.provider), ['gemini', 'omni', 'gemini']);
});
for (const status of [400, 401, 403, 404, 500]) {
  test(`Gemini ${status} does not disclose the prompt to another provider`, async () => {
    geminiStatus = status;
    const res = await request();
    assert.equal(res.status, 500);
    assert.deepEqual(calls.map(c => c.provider), ['gemini']);
    assert.doesNotMatch(await res.text(), /upstream-secret/);
  });
}
test('a blocked Gemini answer does not bypass safety via OmniRoute', async () => {
  geminiBody = { promptFeedback: { blockReason: 'SAFETY' } };
  assert.equal((await request()).status, 500);
  assert.deepEqual(calls.map(c => c.provider), ['gemini']);
});
for (const key of ['OMNIROUTE_BASE_URL', 'OMNIROUTE_API_KEY', 'OMNIROUTE_MODEL']) {
  test(`quota with missing ${key} gives a safe unavailable response`, async () => {
    delete process.env[key];
    geminiStatus = 402;
    const res = await request();
    assert.equal(res.status, 503);
    assert.equal((await res.json()).code, 'AI_UNAVAILABLE');
    assert.deepEqual(calls.map(c => c.provider), ['gemini']);
  });
}
for (const url of ['http://gateway.example.test/v1', 'http://localhost:20128/v1', 'https://user:pass@gateway.example.test/v1', 'https://gateway.example.test/v1?token=secret']) {
  test(`unsafe production gateway URL is rejected: ${url}`, async () => {
    process.env.OMNIROUTE_BASE_URL = url;
    geminiStatus = 429;
    assert.equal((await request()).status, 503);
    assert.deepEqual(calls.map(c => c.provider), ['gemini']);
  });
}
for (const body of [null, {}, { choices: [] }, { choices: [{ message: { content: 123 } }] }, { choices: [{ message: { content: ' ' } }] }]) {
  test(`invalid OmniRoute response is rejected: ${JSON.stringify(body)}`, async () => {
    geminiStatus = 402;
    omniBody = body;
    assert.equal((await request()).status, 503);
  });
}
test('OmniRoute HTTP failure and network failure are sanitized', async () => {
  geminiStatus = 402;
  omniStatus = 500;
  omniBody = { error: 'upstream-secret-must-not-leak' };
  let res = await request();
  assert.equal(res.status, 503);
  assert.doesNotMatch(await res.text(), /upstream-secret/);
  omniFailure = true;
  res = await request();
  assert.equal(res.status, 503);
  assert.doesNotMatch(await res.text(), /upstream-secret/);
});
test('invalid input never calls an AI provider', async () => {
  for (const body of [null, {}, { message: '' }, { message: 123 }, { message: 'x'.repeat(4001) }]) {
    assert.equal((await request(body)).status, 400);
  }
  assert.equal(calls.length, 0);
});
test('unavailable guidance follows the requested language', async () => {
  geminiStatus = 402;
  delete process.env.OMNIROUTE_API_KEY;
  const english = await (await request({ message: 'Breakfast?', language: 'en' })).json();
  assert.match(english.error, /front desk/);
  assert.doesNotMatch(english.error, /[\u3040-\u30ff]/);
  const japanese = await (await request({ message: '朝食は？', language: 'ja' })).json();
  assert.match(japanese.error, /フロント/);
});
test('malformed JSON is rejected before provider calls', async () => {
  const res = await POST(new Request('http://localhost/api/chat', { method: 'POST', body: '{' }));
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});
