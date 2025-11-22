// Enhanced error handling for the worker

export interface WorkerError {
  status: number
  message: string
  code?: string
  details?: any
}

export class APIError extends Error {
  public status: number
  public code?: string
  public details?: any

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class DatabaseError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 500, 'DATABASE_ERROR', details)
    this.name = 'DatabaseError'
  }
}

export class ExternalServiceError extends APIError {
  constructor(service: string, message: string, details?: any) {
    super(`${service} error: ${message}`, 503, 'EXTERNAL_SERVICE_ERROR', details)
    this.name = 'ExternalServiceError'
  }
}

export function handleWorkerError(error: unknown): Response {
  console.error('Worker error:', error)

  if (error instanceof APIError) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined
    }), {
      status: error.status,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  if (error instanceof Error) {
    return new Response(JSON.stringify({
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        stack: error.stack
      } : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return new Response(JSON.stringify({
    success: false,
    error: 'Unknown error occurred',
    code: 'UNKNOWN_ERROR'
  }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function validateImageData(imageData: string): void {
  if (!imageData) {
    throw new ValidationError('Image data is required')
  }

  if (!imageData.startsWith('data:image/')) {
    throw new ValidationError('Invalid image format. Expected data URL starting with "data:image/"')
  }

  // Check for common image formats
  const validFormats = ['data:image/jpeg', 'data:image/jpg', 'data:image/png', 'data:image/webp']
  const isValidFormat = validFormats.some(format => imageData.startsWith(format))
  
  if (!isValidFormat) {
    throw new ValidationError('Unsupported image format. Please use JPG, PNG, or WebP.')
  }

  // Rough size check (base64 is ~4/3 of binary size)
  const estimatedSize = (imageData.length * 3) / 4
  if (estimatedSize > 10 * 1024 * 1024) { // 10MB limit
    throw new ValidationError('Image too large. Please use an image under 10MB.')
  }

  if (estimatedSize < 1000) { // 1KB minimum
    throw new ValidationError('Image too small. Please use a valid image file.')
  }
}

export function validateRequiredEnv(env: any, requiredKeys: string[]): void {
  const missing = requiredKeys.filter(key => !env[key])
  if (missing.length > 0) {
    throw new APIError(`Missing required environment variables: ${missing.join(', ')}`, 500)
  }
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    if (error instanceof Error) {
      throw new APIError(error.message, 500, 'OPERATION_FAILED', {
        originalError: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
    
    throw new APIError('Unknown error in operation', 500)
  }
}
