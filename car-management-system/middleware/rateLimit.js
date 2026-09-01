const buckets = new Map();

// Protects the public auth endpoints without adding another production dependency.
// In a multi-instance deployment, use an external rate-limit store (for example Redis).
const authRateLimit = ({ windowMs = 15 * 60 * 1000, max = 12 } = {}) => (req, res, next) => {
  const key = `${req.ip || "unknown"}:${req.path}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now - current.startedAt >= windowMs) {
    buckets.set(key, { startedAt: now, count: 1 });
    return next();
  }
  current.count += 1;
  if (current.count > max) {
    const retryAfter = Math.ceil((windowMs - (now - current.startedAt)) / 1000);
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({ message: "Too many attempts. Please try again later." });
  }
  next();
};

module.exports = { authRateLimit };
