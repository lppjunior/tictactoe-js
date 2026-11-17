import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { LANGUAGE_PATHS } from './src/i18n.mjs'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode, command }) => {
  const gtmId = loadEnv(mode, root, 'VITE_').VITE_GTM_ID?.trim()
  if (gtmId && !/^GTM-[A-Z0-9]+$/.test(gtmId)) throw new Error('VITE_GTM_ID inválido.')
  if (!gtmId && command === 'build') throw new Error('VITE_GTM_ID é obrigatório para o build. Configure a variável antes de continuar.')
  if (!gtmId) console.warn('VITE_GTM_ID não configurado; Google Tag Manager desativado.')

  const gtm = {
    name: 'google-tag-manager',
    transformIndexHtml () {
      if (!gtmId) return []
      return [
        {
          tag: 'script',
          injectTo: 'head-prepend',
          children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`
        },
        {
          tag: 'noscript',
          injectTo: 'body-prepend',
          children: [{
            tag: 'iframe',
            attrs: {
              src: `https://www.googletagmanager.com/ns.html?id=${gtmId}`,
              height: '0',
              width: '0',
              style: 'display:none;visibility:hidden',
              title: 'Google Tag Manager'
            }
          }]
        }
      ]
    }
  }

  const inlineCss = {
    name: 'inline-css',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler (html, { bundle }) {
        return html.replace(/<link[^>]+href="\/(assets\/[^"]+\.css)"[^>]*>/, (tag, file) => {
          const css = bundle?.[file]?.source
          return css ? `<style>${css}</style>` : tag
        })
      }
    }
  }

  return {
    root,
    plugins: [react(), gtm, inlineCss],
    build: {
      outDir: resolve(root, '../../dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: Object.fromEntries(Object.entries(LANGUAGE_PATHS).map(([code, route]) => [
          code,
          resolve(root, `${route.slice(1)}index.html`)
        ]))
      }
    }
  }
})
