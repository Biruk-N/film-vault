export type ApiSuccess<T> = {
  success: true
  data: T
  error: null
  meta?: Record<string, unknown> | null
}

export type ApiError = {
  success: false
  data: null
  error: {
    code: string
    message: string
    details?: unknown
    fields?: Record<string, string>
  }
  meta?: Record<string, unknown> | null
}

export function ok<T>(data: T, meta?: Record<string, unknown> | null): ApiSuccess<T> {
  return { success: true, data, error: null, meta }
}

export function err(code: string, message: string, details?: unknown, meta?: Record<string, unknown> | null): ApiError {
  return { success: false, data: null, error: { code, message, details }, meta }
}
