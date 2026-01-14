import Head from "next/head";
import { useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import gsap from "gsap";
import LoginForm from "../components/portfolio/LoginForm";
import ProjectCard from "../components/portfolio/ProjectCard";

export default function Portfolio({
	isAuthenticated: initialAuth,
	portfolioProjects: initialProjects,
}) {
	const { language, toggleLanguage, t } = useLanguage();
	const isAuthenticated = initialAuth === true;
	const portfolioProjects = initialProjects || [];

	const projectsRef = useRef([]);
	const headerRef = useRef(null);

	// Animación de entrada para proyectos
	useEffect(() => {
		if (isAuthenticated && projectsRef.current.length > 0) {
			gsap.fromTo(
				headerRef.current,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
			);

			gsap.fromTo(
				projectsRef.current,
				{ opacity: 0, y: 50, scale: 0.95 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.6,
					stagger: 0.15,
					ease: "power3.out",
					delay: 0.3
				}
			);
		}
	}, [isAuthenticated, portfolioProjects.length]);

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

				<LoginForm
					t={t}
					language={language}
					toggleLanguage={toggleLanguage}
				/>
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
				<section ref={headerRef} className="min-h-[40vh] flex items-center pt-24">
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
								<ProjectCard
									key={i}
									ref={(el) => (projectsRef.current[i] = el)}
									project={project}
								/>
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
