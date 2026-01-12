import jwt from "jsonwebtoken";

export default function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { password } = req.body || {};
	const PORTFOLIO_PASSWORD = process.env.PORTFOLIO_PASSWORD;
	const PORTFOLIO_AUTH_SECRET = process.env.PORTFOLIO_AUTH_SECRET;

	if (!PORTFOLIO_PASSWORD || !PORTFOLIO_AUTH_SECRET) {
		return res.status(500).json({ error: "Server not configured" });
	}

	if (!password) {
		return res.status(400).json({ error: "Password required" });
	}

	if (password !== PORTFOLIO_PASSWORD) {
		return res.status(401).json({ error: "Invalid password" });
	}

	// Create JWT
	const token = jwt.sign({ authenticated: true }, PORTFOLIO_AUTH_SECRET, {
		expiresIn: "1h",
	});

	const isProd = process.env.NODE_ENV === "production";

	// Set HttpOnly cookie
	res.setHeader(
		"Set-Cookie",
		`portfolio_auth=${token}; HttpOnly; Path=/; Max-Age=${
			60 * 60
		}; SameSite=Lax${isProd ? "; Secure" : ""}`
	);

	return res.status(200).json({ success: true });
}
