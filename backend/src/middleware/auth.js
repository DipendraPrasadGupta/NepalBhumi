import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  // Extract token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.error(`[AUTH] Missing token on ${req.method} ${req.path}`);
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.debug(`[AUTH] Token verified for user ${decoded.userId} with role: ${decoded.role}`);
    next();
  } catch (error) {
    console.error(`[AUTH] Token verification failed for ${req.method} ${req.path}:`, error.message);
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error('[AUTH] No user in request - protect middleware may not have run');
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    if (!roles.includes(req.user.role)) {
      console.error(`[AUTH] User ${req.user.userId} with role ${req.user.role} attempted to access ${roles.join(', ')} route`);
      return res.status(403).json({ message: 'Not authorized to access this route' });
    }

    console.debug(`[AUTH] User ${req.user.userId} with role ${req.user.role} authorized for ${req.method} ${req.path}`);
    next();
  };
};

export const admin = (req, res, next) => {
  if (!req.user) {
    console.error('[AUTH] No user in request - protect middleware may not have run');
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  if (req.user.role !== 'admin') {
    console.error(`[AUTH] User ${req.user.userId} with role ${req.user.role} attempted to access admin route`);
    return res.status(403).json({ message: 'Only admins can access this route' });
  }

  console.debug(`[AUTH] Admin user ${req.user.userId} authorized for ${req.method} ${req.path}`);
  next();
};
