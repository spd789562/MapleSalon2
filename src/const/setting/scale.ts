import { getCurrentWebview } from '@tauri-apps/api/webview';

export const WindowScales = [1, 1.25, 1.5, 1.75, 2, 2.5, 3];

export const DefaultWindowScale = 1;

export function setWindowZoom(scale: number) {
  return getCurrentWebview().setZoom(scale);
}

export function isValidWindowScale(value: number): boolean {
  return WindowScales.includes(value);
}
