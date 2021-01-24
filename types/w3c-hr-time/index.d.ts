declare module 'w3c-hr-time' {
  export type DOMHighResTimeStamp = number
  const kTimeOrigin: unique symbol
  const kTimeOriginTimestamp: unique symbol
  export class Performance {
    get timeOrigin (): number;
    now (): DOMHighResTimeStamp;
    toJSON (): {
      timeOrigin: number
    };
    [kTimeOrigin]: [number, number];
    [kTimeOriginTimestamp]: number
  }
  export function getGlobalMonotonicClockMS (): number
  export const clockIsAccurate: boolean
}
