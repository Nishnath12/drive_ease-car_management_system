const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "Authentication required" });
  if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Authentication service is not configured" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired or token is invalid" });
  }
};

exports.checkSupervisor = (req, res, next) => {
  if (req.user?.role !== "supervisor") return res.status(403).json({ message: "Access denied: supervisor privileges required" });
  next();
};

exports.checkEmployee = (req, res, next) => {
  if (!['supervisor', 'employee'].includes(req.user?.role)) return res.status(403).json({ message: "Access denied: staff privileges required" });
  next();
};
