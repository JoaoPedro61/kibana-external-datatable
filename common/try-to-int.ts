export function tryToInt(v: any, defaultValue: number = 0): number {
  try {
    return parseInt(v, 10);
  } catch(_) {
    return defaultValue;
  }
}