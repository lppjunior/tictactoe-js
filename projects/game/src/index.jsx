import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { getRedirectPath } from './i18n.mjs'
import './styles.css'

const redirectPath = getRedirectPath({
  pathname: window.location.pathname,
  browserLanguages: window.navigator.languages ?? [window.navigator.language],
  userAgent: window.navigator.userAgent,
  storage: window.localStorage
})

if (redirectPath) {
  window.location.replace(redirectPath + window.location.search + window.location.hash)
} else {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
