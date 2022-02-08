/* eslint-disable */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // see https://vitejs.dev/guide/env-and-mode.html#env-files
  // add .env variables.
  // readonly VITE_APP_TITLE: string
  readonly VITE_APP_ROLLBAR_TOKEN: string
  readonly VITE_APP_ROLLBAR_ENABLED: string
  readonly VITE_APP_GIT_SHA: string
  readonly VITE_APP_MIRAGE_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
