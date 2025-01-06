import { isArray } from 'lodash-es'

export function isNotEmptyArray(val: any[]) {
  return isArray(val) && val.length > 0
}

export const normalizeToArray = <T>(value: T | T[]) => (isArray(value) ? value : [value])
