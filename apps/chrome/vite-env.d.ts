/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_IFRAME_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
