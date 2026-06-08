/**
 * Express v5 async handler wrapper.
 *
 * Express 5 changed how route handlers work — async errors are auto-caught,
 * but the `next` function is NOT passed as the 3rd argument to `(req, res)` 
 * handlers registered via `router.get()` / `router.post()` etc.
 *
 * This wrapper catches errors from async handlers and sends a safe JSON 
 * response instead of relying on next().
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error(`💥 ${req.method} ${req.originalUrl}:`, error.message);

    // Mongoose validation errors → 400
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // Mongoose cast error → 400
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid ${error.path}: ${error.value}` });
    }
    // Duplicate key → 409
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Duplicate value violates a unique field' });
    }

    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  });

module.exports = asyncHandler;
