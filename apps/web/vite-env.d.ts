/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CLIENT_ENTRY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
