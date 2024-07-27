/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CLIENT_ENTRY: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
