const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;  // Add phone here

    if (!name || !email || !password || !role || !phone) {  // Validate phone too
      return res.status(400).json({ message: "All fields including phone are required" });
    }

    const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",  // Include phone here
      [name, email, hashedPassword, role, phone]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id,name:user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout (Stateless)
exports.logout = async (req, res) => {
  // This only works if you're storing JWTs in client-side localStorage or cookies.
  // Client should simply delete the token.
  res.status(200).json({ message: "Logged out successfully (token must be removed client-side)" });
};
