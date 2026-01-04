import Head from "next/head";
import { useEffect, useRef } from "react";

export default function Home() {
	const revealRefs = useRef([]);

	const services = [
		{
			num: "01",
			title: "Diseno de Interfaces",
			desc: "Creo interfaces intuitivas y elegantes que conectan con los usuarios.",
		},
		{
			num: "02",
			title: "Desarrollo Frontend",
			desc: "Codigo limpio y performante con las tecnologias mas modernas.",
		},
		{
			num: "03",
			title: "Experiencias Interactivas",
			desc: "Animaciones y microinteracciones que dan vida a los proyectos.",
		},
	];

	const skills = [
		{ name: "React / Next.js", years: "5 anos" },
		{ name: "TypeScript", years: "4 anos" },
		{ name: "Diseno UI/UX", years: "6 anos" },
		{ name: "CSS / Tailwind", years: "6 anos" },
		{ name: "Node.js", years: "4 anos" },
	];

	const projects = [
		{
			num: "01",
			title: "E-Commerce Platform",
			category: "Desarrollo Web",
			year: "2024",
		},
		{
			num: "02",
			title: "Dashboard Analytics",
			category: "Aplicacion Web",
			year: "2024",
		},
		{
			num: "03",
			title: "Mobile Banking App",
			category: "UI/UX Design",
			year: "2023",
		},
	];

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

	const addToRefs = (el) => {
		if (el && !revealRefs.current.includes(el)) {
			revealRefs.current.push(el);
		}
	};

	return (
		<>
			<Head>
				<title>David Londono | Creative Developer</title>
				<meta
					name="description"
					content="Frontend Developer & UI Designer based in Colombia"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="page-transition">
				{/* Navigation */}
				<nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-sm">
					<div className="container-editorial py-6 flex justify-between items-center">
						<a href="#" className="font-serif text-xl">
							DL
						</a>
						<div className="hidden md:flex gap-8">
							{["Inicio", "Servicios", "Proyectos", "Contacto"].map(
								(item) => (
									<a
										key={item}
										href={`#${item.toLowerCase()}`}
										className="nav-link"
									>
										{item}
									</a>
								)
							)}
						</div>
					</div>
				</nav>

				{/* Hero Section */}
				<section
					id="inicio"
					className="min-h-screen flex items-center pt-24"
				>
					<div className="container-editorial">
						<div className="grid-editorial items-end">
							{/* Left Column */}
							<div className="space-y-6">
								<p className="body-sm">Frontend Developer</p>
								<div className="accent-line"></div>
							</div>

							{/* Right Column */}
							<div className="space-y-8">
								<h1 className="display-xl">
									David
									<br />
									Londono
								</h1>
								<p className="body-lg max-w-lg">
									Creo experiencias digitales que combinan estetica y
									funcionalidad. Diseno y desarrollo interfaces que
									cuentan historias.
								</p>
								<a href="#contacto" className="btn-minimal">
									<span>Hablemos</span>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M7 17L17 7M17 7H7M17 7V17" />
									</svg>
								</a>
							</div>
						</div>

						{/* Scroll indicator */}
						<div className="mt-24 flex items-center gap-4">
							<span className="body-sm">Scroll</span>
							<div className="w-px h-12 bg-[var(--color-border)]"></div>
						</div>
					</div>
				</section>

				{/* Marquee */}
				<div className="marquee-editorial my-12">
					<div className="marquee-content">
						{[...Array(2)].map((_, i) => (
							<div key={i} className="flex items-center">
								{[
									"React",
									"Next.js",
									"TypeScript",
									"Figma",
									"Tailwind",
									"Node.js",
								].map((tech, j) => (
									<span
										key={j}
										className="mx-12 text-2xl md:text-4xl font-serif text-[var(--color-text-light)]"
									>
										{tech}
									</span>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Services Section */}
				<section id="servicios" className="section">
					<div className="container-editorial">
						<div
							ref={addToRefs}
							className="reveal grid-editorial items-start"
						>
							{/* Left */}
							<div className="sticky top-32">
								<p className="body-sm mb-4">Servicios</p>
								<h2 className="display-md">
									Lo que
									<br />
									hago mejor
								</h2>
							</div>

							{/* Right */}
							<div>
								{services.map((service, i) => (
									<div
										key={i}
										ref={addToRefs}
										className={`reveal delay-${i + 1} card-minimal`}
									>
										<div className="flex justify-between items-start mb-4">
											<span className="number-indicator">
												{service.num}
											</span>
											<span className="body-sm">Servicio</span>
										</div>
										<h3 className="display-md mb-4">
											{service.title}
										</h3>
										<p className="text-[var(--color-text-light)] max-w-md">
											{service.desc}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* About Section */}
				<section className="section bg-[var(--color-bg-alt)]">
					<div className="container-editorial">
						<div
							ref={addToRefs}
							className="reveal grid-asymmetric items-center"
						>
							{/* Left - Big text */}
							<div>
								<p className="body-sm mb-6">Sobre mi</p>
								<h2 className="display-lg mb-8">
									Mas de 6 anos creando experiencias digitales
									memorables
								</h2>
								<p className="body-lg">
									Soy un desarrollador frontend apasionado por el
									diseno y la tecnologia. Me especializo en crear
									interfaces que no solo se ven bien, sino que
									funcionan de manera excepcional.
								</p>
							</div>

							{/* Right - Skills */}
							<div className="space-y-0">
								<p className="body-sm mb-6">Habilidades</p>
								{skills.map((skill, i) => (
									<div key={i} className="skill-item">
										<span className="font-serif">{skill.name}</span>
										<span className="skill-dots"></span>
										<span className="body-sm">{skill.years}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Projects Section */}
				<section id="proyectos" className="section">
					<div className="container-editorial">
						<div ref={addToRefs} className="reveal mb-16">
							<p className="body-sm mb-4">Proyectos Seleccionados</p>
							<h2 className="display-lg">Trabajo reciente</h2>
						</div>

						<div className="space-y-0">
							{projects.map((project, i) => (
								<div
									key={i}
									ref={addToRefs}
									className={`reveal delay-${i + 1}`}
								>
									<a
										href="#"
										className="group block py-8 md:py-12 border-b border-[var(--color-border)] transition-all hover:pl-4"
									>
										<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
											<div className="flex items-baseline gap-6">
												<span className="number-indicator">
													{project.num}
												</span>
												<h3 className="display-md group-hover:text-[var(--color-accent)] transition-colors">
													{project.title}
												</h3>
											</div>
											<div className="flex items-center gap-8">
												<span className="body-sm">
													{project.category}
												</span>
												<span className="body-sm">
													{project.year}
												</span>
												<svg
													className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
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
								</div>
							))}
						</div>

						<div ref={addToRefs} className="reveal mt-12">
							<a
								href="https://github.com/davidlondonor"
								target="_blank"
								rel="noopener noreferrer"
								className="btn-minimal"
							>
								<span>Ver todos los proyectos</span>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M7 17L17 7M17 7H7M17 7V17" />
								</svg>
							</a>
						</div>
					</div>
				</section>

				{/* Contact Section */}
				<section
					id="contacto"
					className="section bg-[var(--color-text)] text-[var(--color-bg)]"
				>
					<div className="container-editorial">
						<div ref={addToRefs} className="reveal text-center">
							<p className="body-sm mb-6 text-[var(--color-bg)]/60">
								Contacto
							</p>
							<h2 className="display-xl mb-8">
								Trabajemos
								<br />
								juntos
							</h2>
							<p className="body-lg text-[var(--color-bg)]/70 max-w-xl mx-auto mb-12">
								Siempre estoy abierto a nuevos proyectos y
								colaboraciones interesantes. Si tienes una idea,
								hablemos.
							</p>
							<a
								href="mailto:hola@davidlondono.co"
								className="inline-block text-2xl md:text-4xl font-serif link-underline"
							>
								hola@davidlondono.co
							</a>
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="footer-editorial">
					<div className="container-editorial">
						<div className="flex flex-col md:flex-row justify-between items-center gap-6">
							<p className="body-sm">2024 David Londono</p>
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
										className="nav-link link-underline"
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
