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
	const [showPassword, setShowPassword] = useState(false);
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
					<title>{`${t.portfolio.title} | David Londoño`}</title>
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
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full px-4 py-3 pr-12 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
										placeholder={t.portfolio.passwordPlaceholder}
										autoFocus
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
										title={
											showPassword
												? "Hide password"
												: "Show password"
										}
									>
										{showPassword ? (
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												className="w-5 h-5"
											>
												<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
												<circle cx="12" cy="12" r="3" />
											</svg>
										) : (
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												className="w-5 h-5"
											>
												<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
												<line x1="1" y1="1" x2="23" y2="23" />
											</svg>
										)}
									</button>
								</div>
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
				<title>{`${t.portfolio.title} | David Londoño`}</title>
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
				<section className="min-h-[40vh] flex items-center pt-24">
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{portfolioProjects.map((project, i) => (
								<div
									key={i}
									className="card-minimal overflow-hidden hover:border-[var(--color-accent)] transition-colors group"
								>
									{/* Image */}
									<div className="relative w-full aspect-[4/3] bg-[var(--color-bg-alt)] overflow-hidden">
										<img
											src={project.image}
											alt={project.title}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
										<span className="absolute top-4 left-4 number-indicator bg-[var(--color-bg)]/90 backdrop-blur-sm px-3 py-1">
											{project.num}
										</span>
									</div>

									{/* Content */}
									<div className="p-6">
										<h3 className="display-sm mb-2">{project.title}</h3>

										<p className="body-sm text-[var(--color-accent)] mb-3">
											{project.client}
										</p>

										<p className="text-[var(--color-text-light)] mb-4 text-sm">
											{project.description}
										</p>

										<div className="flex flex-wrap gap-2">
											{project.tech.map((tech, j) => (
												<span
													key={j}
													className="px-3 py-1 text-xs border border-[var(--color-border)] rounded-full"
												>
													{tech}
												</span>
											))}
										</div>
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
				tech: ["UI", "Figma", "UX"],
				description:
					"Plataforma empresarial completa con dashboard de analytics en tiempo real.",
				image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80",
			},
			{
				num: "02",
				title: "Proyecto Confidencial B",
				client: "Startup Fintech",
				year: "2025",
				tech: ["UI", "Figma", "UX"],
				description:
					"Sistema de pagos y gestión financiera con integraciones bancarias.",
				image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
			},
			{
				num: "03",
				title: "Proyecto Confidencial C",
				client: "Agencia Digital",
				year: "2026",
				tech: ["UI", "Figma", "UX"],
				description:
					"Aplicación web para gestión de campañas y métricas de marketing.",
				image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
			},
			{
				num: "04",
				title: "Proyecto Confidencial D",
				client: "E-commerce Global",
				year: "2026",
				tech: ["UI", "Figma", "UX"],
				description:
					"Experiencia de compra rediseñada con enfoque mobile-first y personalización.",
				image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
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
