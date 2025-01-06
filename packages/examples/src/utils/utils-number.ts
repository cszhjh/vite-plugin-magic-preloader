export const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num))

export const clampArrayRange = (index: number, arr: Array<unknown>) =>
  clamp(index, 0, arr.length - 1)
