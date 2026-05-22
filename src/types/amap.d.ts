/// <reference types="vite/client" />

interface Window {
  AMap?: any;
  AMapLoader?: {
    load: (config: {
      key: string;
      version: string;
      plugins?: string[];
    }) => Promise<any>;
  };
  _AMapSecurityConfig?: {
    securityJsCode: string;
  };
}

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}
