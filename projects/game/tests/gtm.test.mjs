import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import { build, resolveConfig } from 'vite'

const configFile = fileURLToPath(new URL('../vite.config.mjs', import.meta.url))

async function buildWithId (id) {
  const previous = process.env.VITE_GTM_ID
  process.env.VITE_GTM_ID = id
  try {
    const result = await build({ configFile, logLevel: 'silent', build: { write: false } })
    return result.output.find(asset => asset.fileName === 'index.html').source
  } finally {
    if (previous === undefined) delete process.env.VITE_GTM_ID
    else process.env.VITE_GTM_ID = previous
  }
}

test('builds the GTM script and noscript fallback with the configured ID', async () => {
  const html = await buildWithId('GTM-TEST123')
  const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'))
  const body = html.slice(html.indexOf('<body>'), html.indexOf('</body>'))
  assert.match(head, /googletagmanager\.com\/gtm\.js\?id=/)
  assert.match(body, /<noscript>\s*<iframe[^>]+googletagmanager\.com\/ns\.html\?id=GTM-TEST123/)
  const script = head.match(/<script>([\s\S]*?)<\/script>/)[1]
  let inserted
  const firstScript = { parentNode: { insertBefore: element => { inserted = element } } }
  const document = { getElementsByTagName: () => [firstScript], createElement: () => ({}) }
  const window = {}
  runInNewContext(script, { document, window })
  assert.equal(inserted.src, 'https://www.googletagmanager.com/gtm.js?id=GTM-TEST123')
  assert.equal(inserted.async, true)
  assert.equal(window.dataLayer[0].event, 'gtm.js')
})

test('rejects builds when the ID is empty or whitespace', async () => {
  for (const id of ['', '   ']) {
    await assert.rejects(buildWithId(id), /VITE_GTM_ID é obrigatório para o build/)
  }
})

test('warns and omits GTM in development if the ID is absent', async () => {
  const warnings = []
  const warn = console.warn
  const previous = process.env.VITE_GTM_ID
  process.env.VITE_GTM_ID = ''
  console.warn = message => warnings.push(message)
  try {
    const config = await resolveConfig({ configFile, logLevel: 'silent' }, 'serve')
    const plugin = config.plugins.find(plugin => plugin.name === 'google-tag-manager')
    assert.deepEqual(plugin.transformIndexHtml(), [])
    assert.ok(warnings.some(message => message.includes('VITE_GTM_ID não configurado')))
  } finally {
    console.warn = warn
    if (previous === undefined) delete process.env.VITE_GTM_ID
    else process.env.VITE_GTM_ID = previous
  }
})

test('rejects invalid IDs instead of injecting them into HTML', async () => {
  await assert.rejects(buildWithId('GTM-INVALID"><script>'), /VITE_GTM_ID inválido/)
})
