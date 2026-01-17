import mongoose from 'mongoose';

/**
 * Middleware to validate MongoDB ObjectId parameters
 * Prevents invalid ObjectId errors that could crash the server
 * @param {string} paramName - The name of the route parameter to validate (default: 'id')
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: `${paramName} parameter is required`
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }

    next();
  };
};

/**
 * Middleware to validate multiple ObjectId parameters
 * @param {Array<string>} paramNames - Array of parameter names to validate
 */
export const validateObjectIds = (...paramNames) => {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName];
      
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${paramName} format`
        });
      }
    }
    
    next();
  };
};

/**
 * Middleware to validate ObjectId in request body
 * @param {string} fieldName - The field name in req.body to validate
 */
export const validateBodyObjectId = (fieldName) => {
  return (req, res, next) => {
    const id = req.body[fieldName];
    
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${fieldName} format`
      });
    }

    next();
  };
};

/**
 * Middleware to sanitize pagination parameters
 * Ensures page and limit are positive integers within safe ranges
 */
export const sanitizePagination = (req, res, next) => {
  const { page, limit } = req.query;

  // Sanitize page number
  if (page) {
    const pageNum = parseInt(page);
    req.query.page = (pageNum > 0 && pageNum <= 1000) ? pageNum : 1;
  }

  // Sanitize limit
  if (limit) {
    const limitNum = parseInt(limit);
    req.query.limit = (limitNum > 0 && limitNum <= 100) ? limitNum : 12;
  }

  next();
};

/**
 * Middleware to sanitize sort parameters
 * Prevents NoSQL injection through sort parameters
 */
export const sanitizeSort = (req, res, next) => {
  const { sortBy } = req.query;

  if (sortBy && typeof sortBy === 'string') {
    // Only allow alphanumeric characters, hyphens, and dots
    const sanitized = sortBy.replace(/[^a-zA-Z0-9.-]/g, '');
    req.query.sortBy = sanitized.substring(0, 50); // Limit length
  }

  next();
};
