import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import gsap from "gsap";
import LoginForm from "../components/portfolio/LoginForm";
import ProjectCard from "../components/portfolio/ProjectCard";
import ArchiveGrid from "../components/portfolio/ArchiveGrid";

const ARCHIVE_ITEMS = [
	{ src: "/images/brand/agronegocios.jpg", caption: "Agronegocios" },
	{ src: "/images/brand/proceso.jpg", caption: "Proceso" },
	{ src: "/images/brand/carpeta-ultrafiltracion.jpg", caption: "Carpeta Ultrafiltración" },
	{ src: "/images/brand/charla-jacto.png", caption: "Charla Jacto" },
	{ src: "/images/brand/material-jacto.png", caption: "Material Jacto" },
	{ src: "/images/brand/oregon.png", caption: "Oregon" },
	{ src: "/images/brand/screen-2017-01-25.png", caption: "Screen 2017" },
	{ src: "/images/brand/portafolio.pdf", caption: "Portafolio (PDF)", type: "pdf" },
];

export default function Portfolio({
	isAuthenticated: initialAuth,
	portfolioProjects: initialProjects,
}) {
	const { language, toggleLanguage, t } = useLanguage();
	const isAuthenticated = initialAuth === true;
	const portfolioProjects = initialProjects || [];
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState("all");

	const projectsRef = useRef([]);
	const headerRef = useRef(null);

	const categories = [
		{ id: "all", label: t.portfolio.filters.all, color: "#C4B5FD" },
		{ id: "web", label: t.portfolio.filters.web, color: "#86EFAC" },
		{ id: "app", label: t.portfolio.filters.app, color: "#FDBA74" },
		{ id: "mobile", label: t.portfolio.filters.mobile, color: "#93C5FD" },
	];

	const filteredProjects =
		activeCategory === "all"
			? portfolioProjects
			: portfolioProjects.filter((p) => p.category === activeCategory);

	// Block scroll when mobile menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMobileMenuOpen]);

	// Header entrance (once)
	useEffect(() => {
		if (isAuthenticated && headerRef.current) {
			gsap.fromTo(
				headerRef.current,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
			);
		}
	}, [isAuthenticated]);

	// Re-animate grid when filter changes
	useEffect(() => {
		if (!isAuthenticated) return;
		const els = projectsRef.current.filter(Boolean);
		if (!els.length) return;
		gsap.fromTo(
			els,
			{ opacity: 0, y: 30, scale: 0.97 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.5,
				stagger: 0.08,
				ease: "power3.out",
			},
		);
	}, [activeCategory, isAuthenticated]);

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

						{/* Desktop Menu */}
						<div className="hidden md:flex gap-8 items-center">
							<a href="/#inicio" className="nav-link">
								{t.nav.home}
							</a>
							<a href="/#servicios" className="nav-link">
								{t.nav.services}
							</a>
							<a href="/portfolio" className="nav-link text-[var(--color-accent)]">
								{t.nav.portfolio}
							</a>
							<a href="/#proyectos" className="nav-link">
								{t.nav.projects}
							</a>
							<a href="/#contacto" className="nav-link">
								{t.nav.contact}
							</a>
							<button
								onClick={toggleLanguage}
								className="nav-link text-sm uppercase"
								title="Change language"
							>
								{language === "es" ? "EN" : "ES"}
							</button>
							<button
								onClick={handleLogout}
								className="nav-link text-sm border border-[var(--color-border)] px-4 py-2 rounded-sm hover:border-[var(--color-accent)]"
							>
								{t.portfolio.logout}
							</button>
						</div>

						{/* Mobile Menu Button */}
						<button
							className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center relative z-[60]"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Toggle menu"
						>
							<span className={`block h-[2px] bg-[var(--color-text)] transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-8'}`}></span>
							<span className={`block h-[2px] bg-[var(--color-text)] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-6 opacity-100'}`}></span>
							<span className={`block h-[2px] bg-[var(--color-text)] transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-8'}`}></span>
						</button>
					</div>

					{/* Mobile Menu Overlay */}
					<div className={`md:hidden fixed inset-0 bg-[var(--color-bg)] z-[50] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
						<div className="container-editorial h-full flex flex-col justify-center items-center gap-8">
							<a
								href="/#inicio"
								className="text-2xl font-serif hover:text-[var(--color-accent)] transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.home}
							</a>
							<a
								href="/#servicios"
								className="text-2xl font-serif hover:text-[var(--color-accent)] transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.services}
							</a>
							<a
								href="/portfolio"
								className="text-2xl font-serif text-[var(--color-accent)]"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.portfolio}
							</a>
							<a
								href="/#proyectos"
								className="text-2xl font-serif hover:text-[var(--color-accent)] transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.projects}
							</a>
							<a
								href="/#contacto"
								className="text-2xl font-serif hover:text-[var(--color-accent)] transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.contact}
							</a>
							<button
								onClick={() => {
									toggleLanguage();
									setIsMobileMenuOpen(false);
								}}
								className="text-xl uppercase border border-[var(--color-border)] px-6 py-2 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
							>
								{language === "es" ? "EN" : "ES"}
							</button>
							<button
								onClick={() => {
									handleLogout();
									setIsMobileMenuOpen(false);
								}}
								className="text-xl border border-[var(--color-border)] px-6 py-2 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
							>
								{t.portfolio.logout}
							</button>
						</div>
					</div>
				</nav>

				{/* Header */}
				<section
					ref={headerRef}
					className="min-h-[40px] flex items-center pt-24"
				>
					<div className="container-editorial">
						<div className="grid-editorial items-end">
							<div className="space-y-4">
								<h1
									className="display-md"
									style={{ whiteSpace: "pre-line" }}
								>
									{t.portfolio.privateTitle}
								</h1>
								<p className="body-md max-w-lg">
									{t.portfolio.privateDescription}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Projects Section */}
				<section className="section">
					<div className="container-editorial">
						{/* Category filter chips */}
						<div className="flex flex-wrap gap-2 mt-16 mb-8 overflow-x-auto pb-1 -mx-1 px-1">
							{categories.map((cat) => {
								const isActive = activeCategory === cat.id;
								return (
									<button
										key={cat.id}
										onClick={() => setActiveCategory(cat.id)}
										aria-pressed={isActive}
										className={`px-4 py-2 text-[1.25rem] rounded-full whitespace-nowrap transition-all ${
											isActive ? "font-bold" : "opacity-70 hover:opacity-100"
										}`}
										style={{
											backgroundColor: cat.color,
											color: "var(--color-text)",
										}}
									>
										{cat.label}
									</button>
								);
							})}
						</div>

						{filteredProjects.length > 0 ? (
							<div
								key={activeCategory}
								className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
							>
								{filteredProjects.map((project, i) => (
									<ProjectCard
										key={project.num}
										ref={(el) => (projectsRef.current[i] = el)}
										project={project}
									/>
								))}
							</div>
						) : (
							<p className="body-sm text-[var(--color-text-light)] py-12 text-center">
								{t.portfolio.emptyState}
							</p>
						)}
					</div>
				</section>

				{/* Archive */}
				<ArchiveGrid
					items={ARCHIVE_ITEMS}
					title={t.portfolio.archiveTitle}
					description={t.portfolio.archiveDescription}
				/>

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
				title: "Dashboard Empresarial",
				client: "EPM",
				year: "2025",
				category: "app",
				tech: ["UI", "Figma", "UX"],
				description:
					"Plataforma empresarial completa con dashboard de analytics en tiempo real.",
				image: "/images/epm.png",
				url: "https://www.epm.com.co/",
			},
			{
				num: "02",
				title: "Proyecto Energía",
				client: "XM",
				year: "2025",
				category: "app",
				tech: ["UI", "Figma", "UX"],
				description:
					"Sistema de pagos y gestión financiera con integraciones bancarias.",
				image: "/images/xm.png",
				url: "https://www.xm.com.co/",
			},
			{
				num: "03",
				title: "Proyecto Mobile Educatic",
				client: "Educatic",
				year: "2026",
				category: "mobile",
				tech: ["UI", "Figma", "UX"],
				description:
					"Aplicación web para gestión Educativa y métricas de marketing.",
				image: "/images/educatic.png",
				url: "https://www.educatic.com.co/",
			},
			{
				num: "04",
				title: "Proyecto Confidencial D",
				client: "E-commerce Global",
				year: "2026",
				category: "web",
				tech: ["UI", "Figma", "UX"],
				description:
					"Experiencia de compra rediseñada con enfoque mobile-first y personalización.",
				image: "/images/confidencial-d.png",
			},
			{
				num: "05",
				title: "Visual 8 Pro",
				client: "visual8.pro",
				year: "2026",
				category: "web",
				tech: ["UI", "Web", "UX"],
				description:
					"Página web corporativa con diseño moderno y experiencia de usuario optimizada.",
				image: "/images/visual8pro.png",
				url: "https://visual8.pro",
			},
			{
				num: "06",
				title: "Trans Pacific Atlantic",
				client: "Trans Pacific Atlantic",
				year: "2026",
				category: "web",
				tech: ["UI", "Web", "UX"],
				description: "Logística B2B.",
				image: "/images/transpacificatlantic.jpg",
				url: "https://transpacificatlantic.com",
			},
			{
				num: "07",
				title: "Specialized Fitness Nutrition",
				client: "Specialized Fitness Nutrition",
				year: "2025",
				category: "web",
				tech: ["UI", "Web", "UX"],
				description: "Nutrición deportiva especializada.",
				image: "/images/specializedfitnessnutrition.jpg",
				url: "https://specializedfitnessnutrition.com/",
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
