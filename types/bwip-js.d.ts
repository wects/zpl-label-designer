declare module 'bwip-js' {
  export function toCanvas(canvas: string | HTMLCanvasElement, opts: any): Promise<void>;
  export function toSVG(opts: any): string;
  export function raw(bcid: string, text: string, opts?: any): any[];
}
