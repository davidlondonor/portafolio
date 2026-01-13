import { logAccess } from "../../lib/access-logger";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
	const userAgent = req.headers['user-agent'] || 'unknown';

	const isProd = process.env.NODE_ENV === "production";

	// Expire cookie
	res.setHeader(
		"Set-Cookie",
		`portfolio_auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${isProd ? "; Secure" : ""}`
	);

	// Log logout event
	await logAccess({
		ip: clientIp,
		userAgent,
		success: true,
		reason: 'logout'
	});

	return res.status(200).json({ success: true });
}
