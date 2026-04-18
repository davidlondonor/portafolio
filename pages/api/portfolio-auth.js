import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { password } = req.body || {};
	if (!password) {
		return res.status(400).json({ error: "Password required" });
	}

	const hash = process.env.PORTFOLIO_PASSWORD_HASH;
	const secret = process.env.PORTFOLIO_AUTH_SECRET;
	if (!hash || !secret) {
		return res.status(500).json({ error: "Server not configured" });
	}

	const normalized = password.trim().toLowerCase();
	const ok = await bcrypt.compare(normalized, hash);
	if (!ok) {
		return res.status(401).json({ error: "Invalid credentials" });
	}

	const token = jwt.sign({ authenticated: true }, secret, { expiresIn: "1h" });
	const isProd = process.env.NODE_ENV === "production";
	res.setHeader(
		"Set-Cookie",
		`portfolio_auth=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax${isProd ? "; Secure" : ""}`
	);

	return res.status(200).json({ success: true });
}
