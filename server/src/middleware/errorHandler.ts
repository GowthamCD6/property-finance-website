import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Unhandled Application Error:', err);

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed. Please review your submission.',
      errors: formattedErrors,
    });
    return;
  }

  // Handle SyntaxError (e.g. malformed JSON body)
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    res.status(400).json({
      success: false,
      message: 'Invalid request payload syntax.',
    });
    return;
  }

  // Default internal server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred. Please try again later.',
  });
}
