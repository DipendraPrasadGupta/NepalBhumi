export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
