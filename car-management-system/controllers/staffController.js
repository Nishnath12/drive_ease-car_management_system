const db = require("../config/db");
const bcrypt = require("bcryptjs");

const emailOf = (email) => String(email || "").trim().toLowerCase();
const cleanName = (name) => String(name || "").trim().replace(/\s+/g, " ");

exports.listStaff = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE role IN ('employee','supervisor') ORDER BY created_at DESC");
    res.json({ staff: rows });
  } catch (error) {
    console.error("List staff error:", error);
    res.status(500).json({ message: "Unable to load staff" });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const name = cleanName(req.body.name);
    const email = emailOf(req.body.email);
    const phone = String(req.body.phone || "").trim();
    const password = String(req.body.password || "");
    if (!name || !email || !phone || !password) return res.status(400).json({ message: "Name, email, phone and temporary password are required" });
    if (name.length < 2 || name.length > 100) return res.status(400).json({ message: "Please enter a valid name" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Please enter a valid email address" });
    if (!/^\+?[0-9 ()-]{7,20}$/.test(phone)) return res.status(400).json({ message: "Please enter a valid phone number" });
    if (password.length < 8) return res.status(400).json({ message: "Temporary password must be at least 8 characters" });
    const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(409).json({ message: "An account with this email already exists" });
    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute("INSERT INTO users (name,email,password,role,phone,is_active) VALUES (?,?,?,?,?,1)", [name,email,hash,"employee",phone]);
    await db.execute("INSERT INTO employee_logs (employee_id, action) VALUES (?, ?)", [req.user.id, `Created employee account #${result.insertId} (${email})`]);
    res.status(201).json({ message: "Employee created successfully", employee: { id: result.insertId, name, email, phone, role: "employee", is_active: 1 } });
  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({ message: "Unable to create employee" });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const name = cleanName(req.body.name); const phone = String(req.body.phone || "").trim();
    if (!Number.isInteger(id) || !name || !phone) return res.status(400).json({ message: "Valid employee details are required" });
    const [result] = await db.execute("UPDATE users SET name = ?, phone = ? WHERE id = ? AND role = 'employee'", [name, phone, id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Employee not found" });
    await db.execute("INSERT INTO employee_logs (employee_id, action) VALUES (?, ?)", [req.user.id, `Updated employee account #${id}`]);
    res.json({ message: "Employee updated successfully" });
  } catch (error) { console.error("Update employee error:", error); res.status(500).json({ message: "Unable to update employee" }); }
};

exports.setEmployeeStatus = async (req, res) => {
  try {
    const id = Number(req.params.id); const active = req.body.is_active === true || req.body.is_active === 1;
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid employee" });
    if (id === req.user.id) return res.status(400).json({ message: "You cannot deactivate your own account" });
    const [result] = await db.execute("UPDATE users SET is_active = ? WHERE id = ? AND role = 'employee'", [active ? 1 : 0, id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Employee not found" });
    await db.execute("INSERT INTO employee_logs (employee_id, action) VALUES (?, ?)", [req.user.id, `${active ? 'Activated' : 'Deactivated'} employee account #${id}`]);
    res.json({ message: `Employee ${active ? 'activated' : 'deactivated'} successfully` });
  } catch (error) { console.error("Employee status error:", error); res.status(500).json({ message: "Unable to change employee status" }); }
};
