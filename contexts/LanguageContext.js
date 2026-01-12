import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
	es: {
		nav: {
			home: 'Inicio',
			services: 'Servicios',
			portfolio: 'Portafolio',
			projects: 'Proyectos',
			contact: 'Contacto',
		},
		hero: {
			role: 'Frontend Developer',
			description: 'Creo experiencias digitales que combinan estética y funcionalidad. Diseño y desarrollo interfaces que cuentan historias.',
			scroll: 'Scroll',
		},
		services: {
			title: 'Servicios',
			subtitle: 'Lo que\nhago mejor',
			label: 'Servicio',
			items: [
				{
					title: 'Diseño de Interfaces',
					desc: 'Creo interfaces intuitivas y elegantes que conectan con los usuarios.',
				},
				{
					title: 'Desarrollo Frontend Layout',
					desc: 'Código limpio y performante con las tecnologías más modernas.',
				},
				{
					title: 'Experiencias Interactivas',
					desc: 'Animaciones y microinteracciones que dan vida a los proyectos.',
				},
			],
		},
		about: {
			label: 'Sobre mí',
			title: 'Más de 6 años creando experiencias digitales memorables',
			description: 'Soy un desarrollador frontend apasionado por el diseño y la tecnología. Me especializo en crear interfaces que no solo se ven bien, sino que funcionan de manera excepcional.',
			skillsTitle: 'Habilidades',
			skills: [
				{ name: 'React / Next.js', years: '5 años' },
				{ name: 'TypeScript', years: '4 años' },
				{ name: 'Diseño UI/UX', years: '6 años' },
				{ name: 'CSS / Tailwind', years: '6 años' },
				{ name: 'Accesibilidad', years: '2 años' },
			],
		},
		projects: {
			label: 'Proyectos Seleccionados',
			title: 'Trabajo reciente',
			viewAll: 'Ver todos los proyectos',
			items: [
				{
					title: 'E-Commerce Platform',
					category: 'Desarrollo Web',
					year: '2026',
				},
				{
					title: 'Dashboard Analytics',
					category: 'Aplicación Web',
					year: '2026',
				},
				{
					title: 'Mobile Banking App',
					category: 'UI/UX Design',
					year: '2023',
				},
			],
		},
		contact: {
			label: 'Contacto',
			title: 'Trabajemos juntos',
			description: 'Siempre estoy abierto a nuevos proyectos y colaboraciones interesantes. Si tienes una idea, hablemos.',
			form: {
				name: 'Nombre',
				namePlaceholder: 'Tu nombre',
				email: 'Email',
				emailPlaceholder: 'tu@email.com',
				message: 'Mensaje',
				messagePlaceholder: 'Cuéntame sobre tu proyecto...',
				submit: 'Enviar mensaje',
				sending: 'Enviando...',
				success: '✓ Mensaje enviado correctamente. Te responderé pronto!',
				error: '✗ Hubo un error. Por favor intenta nuevamente.',
			},
		},
		footer: {
			copyright: '2026 David Londoño',
		},
		portfolio: {
			title: 'Portfolio Privado',
			subtitle: 'Esta sección requiere contraseña',
			password: 'Contraseña',
			passwordPlaceholder: 'Ingresa la contraseña',
			access: 'Acceder',
			backHome: '← Volver al inicio',
			errorPassword: 'Contraseña incorrecta',
			logout: 'Cerrar sesión',
			privateContent: 'Contenido Privado',
			privateTitle: 'Portfolio\nPrivado',
			privateDescription: 'Proyectos confidenciales y trabajos exclusivos realizados para clientes seleccionados.',
			confidentialProjects: 'Proyectos Confidenciales',
			exclusiveWork: 'Trabajo Exclusivo',
			footerPrivate: '2026 David Londoño - Contenido Privado',
		},
	},
	en: {
		nav: {
			home: 'Home',
			services: 'Services',
			portfolio: 'Portfolio',
			projects: 'Projects',
			contact: 'Contact',
		},
		hero: {
			role: 'Frontend Developer',
			description: 'I create digital experiences that combine aesthetics and functionality. I design and develop interfaces that tell stories.',
			scroll: 'Scroll',
		},
		services: {
			title: 'Services',
			subtitle: 'What I\ndo best',
			label: 'Service',
			items: [
				{
					title: 'Interface Design',
					desc: 'I create intuitive and elegant interfaces that connect with users.',
				},
				{
					title: 'Frontend Layout Development',
					desc: 'Clean and performant code with the most modern technologies.',
				},
				{
					title: 'Interactive Experiences',
					desc: 'Animations and microinteractions that bring projects to life.',
				},
			],
		},
		about: {
			label: 'About me',
			title: 'Over 6 years creating memorable digital experiences',
			description: 'I am a frontend developer passionate about design and technology. I specialize in creating interfaces that not only look good, but work exceptionally.',
			skillsTitle: 'Skills',
			skills: [
				{ name: 'React / Next.js', years: '5 years' },
				{ name: 'TypeScript', years: '4 years' },
				{ name: 'UI/UX Design', years: '6 years' },
				{ name: 'CSS / Tailwind', years: '6 years' },
				{ name: 'Accessibility', years: '2 years' },
			],
		},
		projects: {
			label: 'Selected Projects',
			title: 'Recent work',
			viewAll: 'View all projects',
			items: [
				{
					title: 'E-Commerce Platform',
					category: 'Web Development',
					year: '2026',
				},
				{
					title: 'Dashboard Analytics',
					category: 'Web Application',
					year: '2026',
				},
				{
					title: 'Mobile Banking App',
					category: 'UI/UX Design',
					year: '2023',
				},
			],
		},
		contact: {
			label: 'Contact',
			title: "Let's work together",
			description: "I'm always open to new projects and interesting collaborations. If you have an idea, let's talk.",
			form: {
				name: 'Name',
				namePlaceholder: 'Your name',
				email: 'Email',
				emailPlaceholder: 'you@email.com',
				message: 'Message',
				messagePlaceholder: 'Tell me about your project...',
				submit: 'Send message',
				sending: 'Sending...',
				success: '✓ Message sent successfully. I will reply soon!',
				error: '✗ There was an error. Please try again.',
			},
		},
		footer: {
			copyright: '2026 David Londoño',
		},
		portfolio: {
			title: 'Private Portfolio',
			subtitle: 'This section requires a password',
			password: 'Password',
			passwordPlaceholder: 'Enter password',
			access: 'Access',
			backHome: '← Back to home',
			errorPassword: 'Incorrect password',
			logout: 'Logout',
			privateContent: 'Private Content',
			privateTitle: 'Private\nPortfolio',
			privateDescription: 'Confidential projects and exclusive work for selected clients.',
			confidentialProjects: 'Confidential Projects',
			exclusiveWork: 'Exclusive Work',
			footerPrivate: '2026 David Londoño - Private Content',
		},
	},
};

export function LanguageProvider({ children }) {
	const [language, setLanguage] = useState('es');

	useEffect(() => {
		// Detect browser language on mount
		const browserLang = navigator.language || navigator.userLanguage;
		const lang = browserLang.startsWith('es') ? 'es' : 'en';

		// Check if user has a saved preference
		const savedLang = localStorage.getItem('preferred-language');

		setLanguage(savedLang || lang);
	}, []);

	const toggleLanguage = () => {
		const newLang = language === 'es' ? 'en' : 'es';
		setLanguage(newLang);
		localStorage.setItem('preferred-language', newLang);
	};

	const t = translations[language];

	return (
		<LanguageContext.Provider value={{ language, toggleLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
}
