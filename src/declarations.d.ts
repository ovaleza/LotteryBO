declare module '@coreui/utils/src';

declare module '@coreui/chartjs/dist/js/coreui-chartjs.js';

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'stream' {
  export type Stream = any;
}

declare module 'events' {
  export type EventEmitter = any;
}

declare namespace NodeJS {
  export type TypedArray = any;
}

