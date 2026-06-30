const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

const login = async (req, res) => {
	try {
		const { email, password } = req.body || {};

		console.log('[auth] login attempt for:', email);

		if (!email || !password) {
			console.log('[auth] missing credentials');
			return res.status(400).json({ message: "Email and password required" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			console.log('[auth] user not found:', email);
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const match = await user.comparePassword(password);

		if (!match) {
			console.log('[auth] password mismatch for:', email);
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

		console.log('[auth] login success for:', email);
		res.json({ token, user: { email: user.email, role: user.role } });
	} catch (err) {
		console.error('[auth] login error:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

const changePassword = async (req, res) => {
	const userId = req.user && req.user._id;
	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		return res.status(400).json({ message: "currentPassword and newPassword are required" });
	}

	const user = await User.findById(userId);
	if (!user) return res.status(404).json({ message: "User not found" });

	const match = await user.comparePassword(currentPassword);
	if (!match) return res.status(401).json({ message: "Current password incorrect" });

	user.password = newPassword;
	await user.save();

	res.json({ message: "Password updated" });
};

module.exports = {
	login,
	changePassword
};
