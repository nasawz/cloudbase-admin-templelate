/// <reference types="react-scripts" />

declare module "*.less" {
  const resource: { [key: string]: string };
  export = resource;
}

declare var _tcbEnv: {
  TCB_ENV_ID: string;
  TCB_SERVICE_DOMAIN: string;
};

declare var window: any;
