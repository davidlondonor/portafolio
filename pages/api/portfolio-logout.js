export default function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const isProd = process.env.NODE_ENV === "production";

	// Expire cookie
	res.setHeader(
		"Set-Cookie",
		`portfolio_auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${
			isProd ? "; Secure" : ""
		}`
	);

	return res.status(200).json({ success: true });
}
