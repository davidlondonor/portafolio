import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import AnimatedHero from "../components/AnimatedHero";
import RevealOnScroll from "../components/RevealOnScroll";
import CardAnimation from "../components/CardAnimation";
import SplitTextAnimation from "../components/SplitTextAnimation";
import { ShaderAnimation } from "@/components/ui/shader-animation";

export default function Home() {
	const { language, toggleLanguage, t } = useLanguage();
	const revealRefs = useRef([]);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [formStatus, setFormStatus] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Scroll reveal effect
	useEffect(() => {
		const observerOptions = {
			root: null,
			rootMargin: "0px",
			threshold: 0.1,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
				}
			});
		}, observerOptions);

		revealRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => observer.disconnect();
	}, []);

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

	const addToRefs = (el) => {
		if (el && !revealRefs.current.includes(el)) {
			revealRefs.current.push(el);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setFormStatus("");

		try {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					access_key: "823357c7-b029-4311-b1ca-0b6b07a58924",
					name: formData.name,
					email: formData.email,
					message: formData.message,
				}),
			});

			if (response.ok) {
				setFormStatus("success");
				setFormData({ name: "", email: "", message: "" });
			} else {
				setFormStatus("error");
			}
		} catch (error) {
			setFormStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Head>
				<title>David Londoño | Creative Developer</title>
				<meta
					name="description"
					content="Frontend Developer & UI Designer based in Colombia"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* Animated Shader Background */}
			<div className="fixed inset-0 z-0">
				<ShaderAnimation />
			</div>

			<div className="page-transition relative z-10">
				{/* Navigation */}
				<nav className="fixed top-8 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
					<div className="container-editorial py-6 flex justify-between items-center">
						<a href="#" className="font-serif text-xl text-white">
							DL
						</a>

						{/* Desktop Menu */}
						<div className="hidden md:flex gap-8">
							<a href="#inicio" className="text-white/80 hover:text-white transition-colors">
								{t.nav.home}
							</a>
							<a href="#servicios" className="text-white/80 hover:text-white transition-colors">
								{t.nav.services}
							</a>
							<a href="/portfolio" className="text-white/80 hover:text-white transition-colors">
								{t.nav.portfolio}
							</a>
							<a href="#proyectos" className="text-white/80 hover:text-white transition-colors">
								{t.nav.projects}
							</a>
							<a href="#contacto" className="text-white/80 hover:text-white transition-colors">
								{t.nav.contact}
							</a>
							<button
								onClick={toggleLanguage}
								className="text-white/80 hover:text-white transition-colors text-sm uppercase"
								title="Change language"
							>
								{language === "es" ? "EN" : "ES"}
							</button>
						</div>

						{/* Mobile Menu Button */}
						<button
							className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center relative z-[60]"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Toggle menu"
						>
							<span className={`block h-[2px] transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2 bg-white' : 'w-8 bg-white'}`}></span>
							<span className={`block h-[2px] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 bg-white' : 'w-6 opacity-100 bg-white'}`}></span>
							<span className={`block h-[2px] transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2 bg-white' : 'w-8 bg-white'}`}></span>
					</button>
					</div>

					{/* Mobile Menu Overlay */}
					<div className={`md:hidden fixed inset-0 bg-[#1c1917] z-[50] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
						<div className="container-editorial h-full flex flex-col justify-center items-center gap-8">
							<a
								href="#inicio"
								className="text-2xl font-serif text-[#fafaf9] hover:text-[var(--color-accent)] transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.home}
							</a>
							<a
								href="#servicios"
								className="text-2xl font-serif text-[#fafaf9] hover:text-[var(--color-accent)] transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.services}
							</a>
							<a
								href="/portfolio"
								className="text-2xl font-serif text-[#fafaf9] hover:text-[var(--color-accent)] transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.portfolio}
							</a>
							<a
								href="#proyectos"
								className="text-2xl font-serif text-[#fafaf9] hover:text-[var(--color-accent)] transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.projects}
							</a>
							<a
								href="#contacto"
								className="text-2xl font-serif text-[#fafaf9] hover:text-[var(--color-accent)] transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{t.nav.contact}
							</a>
							<button
								onClick={() => {
									toggleLanguage();
									setIsMobileMenuOpen(false);
								}}
								className="text-xl uppercase text-[#fafaf9] border border-[#fafaf9] px-6 py-2 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
							>
								{language === "es" ? "EN" : "ES"}
							</button>
						</div>
					</div>
				</nav>

				{/* Hero Section with GSAP Animation */}
				<AnimatedHero>
					<section
						id="inicio"
						className="min-h-screen flex items-center pt-24"
					>
						<div className="container-editorial">
							<div className="grid-editorial items-end">
								{/* Left Column */}
								<div className="space-y-6">
									<p className="body-sm hero-title text-white/70">{t.hero.role}</p>
									<div className="accent-line hero-accent-line bg-white/50"></div>
								</div>

								{/* Right Column */}
								<div className="space-y-8">
									<h1 className="display-xl text-white">
										<span className="hero-title block">David</span>
										<span className="hero-title block">Londoño</span>
									</h1>
									<p className="body-lg max-w-lg hero-description text-white/70">
										{t.hero.description}
									</p>
								</div>
							</div>

							{/* Scroll indicator */}
							<div className="mt-24 flex items-center gap-4 scroll-indicator">
								<span className="body-sm text-white/60">{t.hero.scroll}</span>
								<div className="w-px h-12 bg-white/30"></div>
							</div>
						</div>
					</section>
				</AnimatedHero>

				{/* Marquee */}
				<div className="marquee-editorial my-12">
					<div className="marquee-content">
						{[...Array(2)].map((_, i) => (
							<div key={i} className="flex items-center">
								{[
									"React",
									"Next.js",
									"HTML5",
									"CSS3",
									"Figma",
									"Tailwind",
									"Accesibilidad",
								].map((tech, j) => (
									<span
										key={j}
										className="mx-12 text-2xl md:text-4xl font-serif text-white/50"
									>
										{tech}
									</span>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Services Section */}
				<section id="servicios" className="section bg-black/50 backdrop-blur-sm">
					<div className="container-editorial">
						<RevealOnScroll className="grid-editorial items-start">
							{/* Left */}
							<div className="sticky top-32">
								<p className="body-sm mb-4 text-white/60">{t.services.title}</p>
								<h2
									className="display-md text-white"
									style={{ whiteSpace: "pre-line" }}
								>
									{t.services.subtitle}
								</h2>
							</div>

							{/* Right */}
							<div>
								{t.services.items.map((service, i) => (
									<CardAnimation key={i} delay={i * 0.15}>
										<div className="card-minimal border-white/10">
											<div className="flex justify-between items-start mb-4">
												<span className="number-indicator text-white/50">
													{String(i + 1).padStart(2, "0")}
												</span>
												<span className="body-sm text-white/50">
													{t.services.label}
												</span>
											</div>
											<h3 className="display-md mb-4 text-white">
												{service.title}
											</h3>
											<p className="text-white/60 max-w-md">
												{service.desc}
											</p>
										</div>
									</CardAnimation>
								))}
							</div>
						</RevealOnScroll>
					</div>
				</section>

				{/* About Section */}
				<section className="section bg-black/60 backdrop-blur-sm">
					<div className="container-editorial">
						<RevealOnScroll
							className="grid-asymmetric items-center"
							stagger={true}
						>
							{/* Left - Big text */}
							<div>
								<p className="body-sm mb-6 text-white/60">{t.about.label}</p>
								<h2 className="display-lg mb-8 text-white">
									<SplitTextAnimation triggerOnScroll={true}>
										{t.about.title}
									</SplitTextAnimation>
								</h2>
								<p className="body-lg text-white/70">{t.about.description}</p>
							</div>

							{/* Right - Skills */}
							<div className="space-y-0">
								<p className="body-sm mb-6 text-white/60">{t.about.skillsTitle}</p>
								{t.about.skills.map((skill, i) => (
									<div key={i} className="skill-item reveal-item border-white/10">
										<span className="font-serif text-white">{skill.name}</span>
										<span className="skill-dots border-white/20"></span>
										<span className="body-sm text-white/60">{skill.years}</span>
									</div>
								))}
							</div>
						</RevealOnScroll>
					</div>
				</section>

				{/* Projects Section */}
				<section id="proyectos" className="section bg-black/50 backdrop-blur-sm">
					<div className="container-editorial">
						<RevealOnScroll className="mb-16">
							<p className="body-sm mb-4 text-white/60">{t.projects.label}</p>
							<h2 className="display-lg text-white">{t.projects.title}</h2>
						</RevealOnScroll>

						<div className="space-y-0">
							{t.projects.items.map((project, i) => (
								<CardAnimation key={i} delay={i * 0.1}>
									<a
										href="#"
										className="group block py-8 md:py-12 border-b border-white/10 transition-all hover:pl-4"
									>
										<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
											<div className="flex items-baseline gap-6">
												<span className="number-indicator text-white/50">
													{String(i + 1).padStart(2, "0")}
												</span>
												<h3 className="display-md text-white group-hover:text-cyan-400 transition-colors">
													{project.title}
												</h3>
											</div>
											<div className="flex items-center gap-8">
												<span className="body-sm text-white/60">
													{project.category}
												</span>
												<span className="body-sm text-white/60">
													{project.year}
												</span>
												<svg
													className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-white"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path d="M7 17L17 7M17 7H7M17 7V17" />
												</svg>
											</div>
										</div>
									</a>
								</CardAnimation>
							))}
						</div>

						<RevealOnScroll className="mt-12">
							<a
								href="https://github.com/davidlondonor"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-white border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-all"
							>
								<span>{t.projects.viewAll}</span>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="w-5 h-5"
								>
									<path d="M7 17L17 7M17 7H7M17 7V17" />
								</svg>
							</a>
						</RevealOnScroll>
					</div>
				</section>

				{/* Contact Section */}
				<section
					id="contacto"
					className="section bg-[var(--color-text)] text-[var(--color-bg)]"
				>
					<div className="container-editorial">
						<RevealOnScroll className="max-w-2xl mx-auto">
							<div className="text-center mb-12">
								<p className="body-sm mb-6 text-[var(--color-bg)]/60">
									{t.contact.label}
								</p>
								<h2 className="display-md mb-4">{t.contact.title}</h2>
								<p className="body-lg text-[var(--color-bg)]/70">
									{t.contact.description}
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label
										htmlFor="name"
										className="block body-sm mb-2 text-[var(--color-bg)]/80"
									>
										{t.contact.form.name}
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 bg-[var(--color-bg)]/10 border border-[var(--color-bg)]/20 rounded-sm text-[var(--color-bg)] placeholder-[var(--color-bg)]/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
										placeholder={t.contact.form.namePlaceholder}
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block body-sm mb-2 text-[var(--color-bg)]/80"
									>
										{t.contact.form.email}
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 bg-[var(--color-bg)]/10 border border-[var(--color-bg)]/20 rounded-sm text-[var(--color-bg)] placeholder-[var(--color-bg)]/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
										placeholder={t.contact.form.emailPlaceholder}
									/>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block body-sm mb-2 text-[var(--color-bg)]/80"
									>
										{t.contact.form.message}
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleInputChange}
										required
										rows="5"
										className="w-full px-4 py-3 bg-[var(--color-bg)]/10 border border-[var(--color-bg)]/20 rounded-sm text-[var(--color-bg)] placeholder-[var(--color-bg)]/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
										placeholder={t.contact.form.messagePlaceholder}
									></textarea>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full px-8 py-4 bg-[var(--color-bg)] text-[var(--color-text)] border-2 border-[var(--color-bg)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] hover:border-[var(--color-accent)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
								>
									{isSubmitting
										? t.contact.form.sending
										: t.contact.form.submit}
								</button>

								{formStatus === "success" && (
									<p className="text-center text-[var(--color-bg)] body-sm">
										{t.contact.form.success}
									</p>
								)}

								{formStatus === "error" && (
									<p className="text-center text-red-300 body-sm">
										{t.contact.form.error}
									</p>
								)}
							</form>
						</RevealOnScroll>
					</div>
				</section>

				{/* Footer */}
				<footer className="py-12 bg-black/70 backdrop-blur-sm border-t border-white/10">
					<div className="container-editorial">
						<div className="flex flex-col md:flex-row justify-between items-center gap-6">
							<p className="body-sm text-white/60">{t.footer.copyright}</p>
							<div className="flex gap-8">
								{[
									{
										name: "GitHub",
										url: "https://github.com/davidlondonor",
									},
									{
										name: "LinkedIn",
										url: "https://linkedin.com/in/davidlondono",
									},
									{
										name: "Twitter",
										url: "https://twitter.com/davidlondonor",
									},
								].map((social) => (
									<a
										key={social.name}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-white/60 hover:text-white transition-colors"
									>
										{social.name}
									</a>
								))}
							</div>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}
