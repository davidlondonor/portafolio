import Head from "next/head";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Portfolio({
	isAuthenticated: initialAuth,
	portfolioProjects: initialProjects,
}) {
	const { language, toggleLanguage, t } = useLanguage();
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const isAuthenticated = initialAuth === true;
	const portfolioProjects = initialProjects || [];

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const res = await fetch("/api/portfolio-auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});

			if (res.ok) {
				// Reload to let getServerSideProps validate cookie and render protected content
				window.location.reload();
			} else {
				const data = await res.json();
				setError(data?.error || t.portfolio.errorPassword);
				setPassword("");
			}
		} catch (err) {
			setError(t.portfolio.errorPassword);
			setPassword("");
		}
	};

	const handleLogout = async () => {
		try {
			await fetch("/api/portfolio-logout", { method: "POST" });
		} finally {
			window.location.reload();
		}
	};

	// Login Screen
	if (!isAuthenticated) {
		return (
			<>
				<Head>
					<title>{t.portfolio.title} | David Londoño</title>
					<meta name="robots" content="noindex, nofollow" />
				</Head>

				<div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
					<div className="w-full max-w-md px-6">
						<div className="text-center mb-12">
							<h1 className="display-md mb-4">{t.portfolio.title}</h1>
							<p className="body-lg text-[var(--color-text-light)]">
								{t.portfolio.subtitle}
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="password"
									className="block body-sm mb-2"
								>
									{t.portfolio.password}
								</label>
								<input
									type="password"
									id="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-3 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
									placeholder={t.portfolio.passwordPlaceholder}
									autoFocus
								/>
								{error && (
									<p className="mt-2 text-sm text-red-500">{error}</p>
								)}
							</div>

							<button
								type="submit"
								className="w-full btn-minimal justify-center"
							>
								<span>{t.portfolio.access}</span>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M7 17L17 7M17 7H7M17 7V17" />
								</svg>
							</button>
						</form>

						<div className="mt-8 text-center">
							<a href="/" className="nav-link">
								{t.portfolio.backHome}
							</a>
						</div>

						<div className="mt-4 text-center">
							<button
								onClick={toggleLanguage}
								className="nav-link text-sm uppercase"
								title="Change language"
							>
								{language === "es" ? "EN" : "ES"}
							</button>
						</div>
					</div>
				</div>
			</>
		);
	}

	// Portfolio content is provided by getServerSideProps when authenticated

	return (
		<>
			<Head>
				<title>{t.portfolio.title} | David Londoño</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>

			<div className="page-transition">
				{/* Navigation */}
				<nav className="fixed top-8 left-0 right-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-sm">
					<div className="container-editorial py-6 flex justify-between items-center">
						<a href="/" className="font-serif text-xl">
							DL
						</a>
						<div className="flex gap-4 items-center">
							<button
								onClick={toggleLanguage}
								className="nav-link text-sm uppercase"
								title="Change language"
							>
								{language === "es" ? "EN" : "ES"}
							</button>
							<button
								onClick={handleLogout}
								className="nav-link text-sm"
							>
								{t.portfolio.logout}
							</button>
						</div>
					</div>
				</nav>

				{/* Header */}
				<section className="min-h-[60vh] flex items-center pt-24">
					<div className="container-editorial">
						<div className="grid-editorial items-end">
							<div className="space-y-6">
								<p className="body-sm">{t.portfolio.privateContent}</p>
								<div className="accent-line"></div>
							</div>

							<div className="space-y-8">
								<h1
									className="display-xl"
									style={{ whiteSpace: "pre-line" }}
								>
									{t.portfolio.privateTitle}
								</h1>
								<p className="body-lg max-w-lg">
									{t.portfolio.privateDescription}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Projects Section */}
				<section className="section">
					<div className="container-editorial">
						<div className="mb-16">
							<p className="body-sm mb-4">
								{t.portfolio.confidentialProjects}
							</p>
							<h2 className="display-lg">{t.portfolio.exclusiveWork}</h2>
						</div>

						<div className="space-y-12">
							{portfolioProjects.map((project, i) => (
								<div
									key={i}
									className="card-minimal p-8 hover:border-[var(--color-accent)] transition-colors"
								>
									<div className="flex items-start justify-between mb-6">
										<span className="number-indicator">
											{project.num}
										</span>
										<span className="body-sm text-[var(--color-text-light)]">
											{project.year}
										</span>
									</div>

									<h3 className="display-md mb-3">{project.title}</h3>

									<p className="body-sm text-[var(--color-accent)] mb-4">
										{project.client}
									</p>

									<p className="text-[var(--color-text-light)] mb-6 max-w-2xl">
										{project.description}
									</p>

									<div className="flex flex-wrap gap-3">
										{project.tech.map((tech, j) => (
											<span
												key={j}
												className="px-3 py-1 text-sm border border-[var(--color-border)] rounded-full"
											>
												{tech}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="footer-editorial">
					<div className="container-editorial">
						<div className="flex flex-col md:flex-row justify-between items-center gap-6">
							<p className="body-sm">{t.portfolio.footerPrivate}</p>
							<button
								onClick={handleLogout}
								className="nav-link link-underline"
							>
								{t.portfolio.logout}
							</button>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const cookieHeader = context.req.headers.cookie || "";
	const parseCookies = (cookieString) =>
		cookieString
			.split(";")
			.map((c) => c.trim())
			.filter(Boolean)
			.reduce((acc, cur) => {
				const [k, ...v] = cur.split("=");
				acc[k] = decodeURIComponent(v.join("="));
				return acc;
			}, {});

	const cookies = parseCookies(cookieHeader);
	const token = cookies["portfolio_auth"];

	let isAuthenticated = false;
	let projects = [];

	if (token) {
		try {
			const jwt = require("jsonwebtoken");
			const secret = process.env.PORTFOLIO_AUTH_SECRET;
			if (secret) {
				jwt.verify(token, secret);
				isAuthenticated = true;
			}
		} catch (err) {
			isAuthenticated = false;
		}
	}

	if (isAuthenticated) {
		projects = [
			{
				num: "01",
				title: "Proyecto Confidencial A",
				client: "Cliente Enterprise",
				year: "2025",
				tech: ["React", "Node.js", "PostgreSQL"],
				description:
					"Plataforma empresarial completa con dashboard de analytics en tiempo real.",
			},
			{
				num: "02",
				title: "Proyecto Confidencial B",
				client: "Startup Fintech",
				year: "2025",
				tech: ["Next.js", "TypeScript", "Stripe"],
				description:
					"Sistema de pagos y gestión financiera con integraciones bancarias.",
			},
			{
				num: "03",
				title: "Proyecto Confidencial C",
				client: "Agencia Digital",
				year: "2026",
				tech: ["Vue.js", "Firebase", "TailwindCSS"],
				description:
					"Aplicación web para gestión de campañas y métricas de marketing.",
			},
		];
	}

	return {
		props: {
			isAuthenticated,
			portfolioProjects: projects,
		},
	};
}
