import jwt from "jsonwebtoken";
import { verifyPassword, randomDelay } from "../../lib/security";
import { checkRateLimit } from "../../lib/rate-limiter";
import { logAccess } from "../../lib/access-logger";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
	const userAgent = req.headers['user-agent'] || 'unknown';

	// === RATE LIMITING ===
	const rateLimitResult = checkRateLimit(clientIp);
	if (!rateLimitResult.allowed) {
		await logAccess({
			ip: clientIp,
			userAgent,
			success: false,
			reason: 'rate_limit_exceeded',
			attemptsRemaining: 0
		});

		return res.status(429).json({
			error: "Too many attempts. Please try again later.",
			retryAfter: rateLimitResult.retryAfter
		});
	}

	// === VALIDACIÓN DE INPUT ===
	const { password } = req.body || {};
	const PORTFOLIO_PASSWORD_HASH = process.env.PORTFOLIO_PASSWORD_HASH;
	const PORTFOLIO_PASSWORD = process.env.PORTFOLIO_PASSWORD; // Fallback temporal
	const PORTFOLIO_AUTH_SECRET = process.env.PORTFOLIO_AUTH_SECRET;

	if (!PORTFOLIO_AUTH_SECRET) {
		await logAccess({ ip: clientIp, userAgent, success: false, reason: 'server_misconfiguration' });
		return res.status(500).json({ error: "Server not configured" });
	}

	if (!password) {
		await logAccess({ ip: clientIp, userAgent, success: false, reason: 'missing_password' });
		return res.status(400).json({ error: "Password required" });
	}

	// === VERIFICACIÓN DE CONTRASEÑA ===
	let isValid = false;

	// Priorizar hash bcrypt
	if (PORTFOLIO_PASSWORD_HASH) {
		isValid = await verifyPassword(password, PORTFOLIO_PASSWORD_HASH);
	}
	// Fallback a texto plano (DEPRECADO - solo para migración)
	else if (PORTFOLIO_PASSWORD) {
		console.warn('⚠️  WARNING: Using plaintext password. Please set PORTFOLIO_PASSWORD_HASH');
		isValid = password === PORTFOLIO_PASSWORD;
	}
	else {
		await logAccess({ ip: clientIp, userAgent, success: false, reason: 'no_password_configured' });
		return res.status(500).json({ error: "Server not configured" });
	}

	// === TIMING ATTACK PROTECTION ===
	// Siempre agregar delay aleatorio para prevenir timing attacks
	await randomDelay(100, 300);

	if (!isValid) {
		await logAccess({
			ip: clientIp,
			userAgent,
			success: false,
			reason: 'invalid_password',
			attemptsRemaining: rateLimitResult.remaining - 1
		});

		return res.status(401).json({
			error: "Invalid credentials", // Mensaje genérico (no revelar "password incorrecta")
			attemptsRemaining: rateLimitResult.remaining - 1
		});
	}

	// === AUTENTICACIÓN EXITOSA ===
	const token = jwt.sign({ authenticated: true }, PORTFOLIO_AUTH_SECRET, {
		expiresIn: "1h",
	});

	const isProd = process.env.NODE_ENV === "production";

	res.setHeader(
		"Set-Cookie",
		`portfolio_auth=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}; SameSite=Lax${isProd ? "; Secure" : ""}`
	);

	await logAccess({
		ip: clientIp,
		userAgent,
		success: true,
		tokenExpiry: '1h'
	});

	return res.status(200).json({ success: true });
}
