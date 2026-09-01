const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name || !normalizedEmail || !password || !phone) {
      return res.status(400).json({ message: "Name, email, password and phone are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    // Public registration can only create customer accounts. Employee/supervisor
    // accounts must be provisioned separately by an authorized administrator.
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, 'customer', ?)",
      [String(name).trim(), normalizedEmail, hashedPassword, String(phone).trim()]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: result.insertId, name: String(name).trim(), email: normalizedEmail, role: "customer" }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ message: "Authentication service is not configured" });
    }

    const [users] = await db.execute(
      "SELECT id, name, email, password, phone, role FROM users WHERE email = ?",
      [normalizedEmail]
    );
    if (users.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  // JWTs are intentionally stateless. The client removes the token on logout.
  res.status(200).json({ message: "Logged out successfully" });
};
