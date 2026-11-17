import test from 'node:test'
import assert from 'node:assert/strict'
import { LANGUAGES, MESSAGES, languageFromPath, detectLanguage, getRedirectPath } from '../src/i18n.mjs'

const memory = (value) => ({ getItem: () => value })

test('maps paths to languages', () => {
  assert.equal(languageFromPath('/'), 'en')
  assert.equal(languageFromPath('/pt/'), 'pt')
  assert.equal(languageFromPath('/es'), 'es')
})

test('detects the browser language with English fallback', () => {
  assert.equal(detectLanguage(['es-MX', 'en']), 'es')
  assert.equal(detectLanguage(['pt-BR', 'en-US']), 'pt')
  assert.equal(detectLanguage(['de-DE']), 'en')
  assert.equal(detectLanguage(['zh-TW']), 'zh')
})

test('redirects only from the root, never for bots', () => {
  const base = { browserLanguages: ['pt-BR', 'en'], userAgent: 'Mozilla/5.0', storage: memory(null) }
  assert.equal(getRedirectPath({ ...base, pathname: '/' }), '/pt/')
  assert.equal(getRedirectPath({ ...base, pathname: '/es/' }), null)
  assert.equal(getRedirectPath({ ...base, pathname: '/', userAgent: 'Googlebot/2.1' }), null)
  assert.equal(getRedirectPath({ ...base, pathname: '/', storage: memory('en') }), null)
  assert.equal(getRedirectPath({ ...base, pathname: '/', storage: memory('es') }), '/es/')
})

test('all dictionaries share the same keys', () => {
  const keys = Object.keys(MESSAGES.pt).sort()
  for (const code of LANGUAGES) assert.deepEqual(Object.keys(MESSAGES[code]).sort(), keys)
})
