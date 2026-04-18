export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { name, email, message } = req.body || {};

	if (!name || !email || !message) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({ error: "Invalid email format" });
	}

	const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;
	if (!web3formsKey) {
		console.error("WEB3FORMS_ACCESS_KEY not configured");
		return res.status(500).json({ error: "Server configuration error" });
	}

	try {
		const response = await fetch("https://api.web3forms.com/submit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				access_key: web3formsKey,
				name,
				email,
				message,
				from_name: "Portfolio Contact Form",
			}),
		});

		const result = await response.json();

		if (response.ok && result.success) {
			return res.status(200).json({ success: true });
		}

		console.error("Web3Forms error:", result);
		return res.status(500).json({ error: "Failed to send message" });
	} catch (error) {
		console.error("Contact form error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
