import Head from "next/head";
import { useState, useEffect } from "react";

export default function Portfolio() {
	const [password, setPassword] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [error, setError] = useState("");

	const CORRECT_PASSWORD = "DL2026";

	// Check if already authenticated on mount
	useEffect(() => {
		const auth = sessionStorage.getItem("portfolio_auth");
		if (auth === "true") {
			setIsAuthenticated(true);
		}
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password === CORRECT_PASSWORD) {
			setIsAuthenticated(true);
			sessionStorage.setItem("portfolio_auth", "true");
			setError("");
		} else {
			setError("Contraseña incorrecta");
			setPassword("");
		}
	};

	const handleLogout = () => {
		setIsAuthenticated(false);
		sessionStorage.removeItem("portfolio_auth");
		setPassword("");
	};

	// Login Screen
	if (!isAuthenticated) {
		return (
			<>
				<Head>
					<title>Portfolio Privado | David Londono</title>
					<meta name="robots" content="noindex, nofollow" />
				</Head>

				<div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
					<div className="w-full max-w-md px-6">
						<div className="text-center mb-12">
							<h1 className="display-md mb-4">Portfolio Privado</h1>
							<p className="body-lg text-[var(--color-text-light)]">
								Esta sección requiere contraseña
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="password"
									className="block body-sm mb-2"
								>
									Contraseña
								</label>
								<input
									type="password"
									id="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-3 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
									placeholder="Ingresa la contraseña"
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
								<span>Acceder</span>
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
								← Volver al inicio
							</a>
						</div>
					</div>
				</div>
			</>
		);
	}

	// Portfolio Content (after authentication)
	const portfolioProjects = [
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
			year: "2024",
			tech: ["Vue.js", "Firebase", "TailwindCSS"],
			description:
				"Aplicación web para gestión de campañas y métricas de marketing.",
		},
	];

	return (
		<>
			<Head>
				<title>Portfolio Privado | David Londono</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>

			<div className="page-transition">
				{/* Navigation */}
				<nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-sm">
					<div className="container-editorial py-6 flex justify-between items-center">
						<a href="/" className="font-serif text-xl">
							DL
						</a>
						<button
							onClick={handleLogout}
							className="nav-link text-sm"
						>
							Cerrar sesión
						</button>
					</div>
				</nav>

				{/* Header */}
				<section className="min-h-[60vh] flex items-center pt-24">
					<div className="container-editorial">
						<div className="grid-editorial items-end">
							<div className="space-y-6">
								<p className="body-sm">Contenido Privado</p>
								<div className="accent-line"></div>
							</div>

							<div className="space-y-8">
								<h1 className="display-xl">
									Portfolio
									<br />
									Privado
								</h1>
								<p className="body-lg max-w-lg">
									Proyectos confidenciales y trabajos exclusivos
									realizados para clientes seleccionados.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Projects Section */}
				<section className="section">
					<div className="container-editorial">
						<div className="mb-16">
							<p className="body-sm mb-4">Proyectos Confidenciales</p>
							<h2 className="display-lg">Trabajo Exclusivo</h2>
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

									<h3 className="display-md mb-3">
										{project.title}
									</h3>

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
							<p className="body-sm">2026 David Londono - Contenido Privado</p>
							<button
								onClick={handleLogout}
								className="nav-link link-underline"
							>
								Cerrar sesión
							</button>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}
