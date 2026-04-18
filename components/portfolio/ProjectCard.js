import Image from "next/image";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function loc(value, lang) {
	if (value == null) return "";
	if (typeof value === "string") return value;
	return value[lang] || value.es || value.en || "";
}

const ProjectCard = forwardRef(({ project }, ref) => {
	const { language, t } = useLanguage();
	const a11y = t.portfolio.a11y;
	const images = Array.isArray(project.images)
		? project.images
		: project.image
		? [project.image]
		: [];
	const [openIndex, setOpenIndex] = useState(null);
	const isOpen = openIndex !== null;
	const description = loc(project.description, language);

	const closeModal = useCallback(() => setOpenIndex(null), []);
	const goPrev = useCallback(() => {
		setOpenIndex((i) =>
			i === null ? null : (i - 1 + images.length) % images.length,
		);
	}, [images.length]);
	const goNext = useCallback(() => {
		setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
	}, [images.length]);

	useEffect(() => {
		if (!isOpen) return;
		const onKey = (e) => {
			if (e.key === "Escape") closeModal();
			else if (e.key === "ArrowLeft") goPrev();
			else if (e.key === "ArrowRight") goNext();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [isOpen, closeModal, goPrev, goNext]);

	// Swipe navigation on touch devices
	const touchStartX = useRef(null);
	const onTouchStart = (e) => {
		touchStartX.current = e.touches[0].clientX;
	};
	const onTouchEnd = (e) => {
		if (touchStartX.current === null) return;
		const deltaX = e.changedTouches[0].clientX - touchStartX.current;
		touchStartX.current = null;
		if (Math.abs(deltaX) < 40) return;
		if (deltaX < 0) goNext();
		else goPrev();
	};

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) closeModal();
	};

	const previewSrc = images[0];
	const currentSrc = isOpen ? images[openIndex] : null;
	const hasMany = images.length > 1;

	return (
		<>
			<div
				ref={ref}
				className="card-minimal overflow-hidden hover:border-[var(--color-accent)] transition-colors group"
			>
				{/* Image */}
				<div
					className="relative w-full aspect-[4/3] bg-[var(--color-bg-alt)] overflow-hidden rounded-[1.5rem] cursor-pointer"
					onClick={() => setOpenIndex(0)}
				>
					{previewSrc && (
						<Image
							src={previewSrc}
							alt={`${project.title} - ${description}`}
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-contain transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>
					)}
					<span className="absolute top-4 left-4 number-indicator bg-[var(--color-bg)]/90 backdrop-blur-sm px-3 py-1">
						{project.num}
					</span>
					{hasMany && (
						<span className="absolute top-4 right-4 text-xs bg-[var(--color-bg)]/90 backdrop-blur-sm px-2 py-1 rounded-full">
							+{images.length - 1}
						</span>
					)}
				</div>

				{/* Content */}
				<div className="p-6">
					<h3 className="display-sm mb-2">{project.title}</h3>

					<p className="body-sm text-[var(--color-accent)] font-bold mb-3">
						{project.client}
					</p>

					<p className="text-[var(--color-text-light)] mb-4 text-sm">
						{description}
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

					{project.url && (
						<a
							href={project.url}
							target="_blank"
							rel="noopener noreferrer nofollow"
							className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] hover:[text-shadow:0.5px_0_0_currentColor]"
						>
							{project.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-4 h-4"
							>
								<path d="M7 17L17 7M17 7H8M17 7v9" />
							</svg>
						</a>
					)}
				</div>
			</div>

			{/* Modal */}
			{isOpen && currentSrc && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
					onClick={handleBackdropClick}
					onTouchStart={onTouchStart}
					onTouchEnd={onTouchEnd}
				>
					{hasMany && (
						<button
							onClick={goPrev}
							className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-accent)] transition-colors z-10 p-3"
							aria-label={a11y.prev}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-8 h-8 md:w-10 md:h-10"
							>
								<polyline points="15 18 9 12 15 6" />
							</svg>
						</button>
					)}

					<div className="relative max-w-3xl max-h-[85vh] m-4">
						<button
							onClick={closeModal}
							className="absolute -top-12 right-0 text-white hover:text-[var(--color-accent)] transition-colors z-10 p-2"
							aria-label={a11y.close}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-8 h-8"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>

						<Image
							key={currentSrc}
							src={currentSrc}
							alt={`${project.title} - ${description}`}
							width={1200}
							height={900}
							className="object-contain max-h-[80vh] w-auto rounded-lg"
						/>
						{hasMany && (
							<p className="mt-3 text-sm text-white/60 text-center">
								{openIndex + 1} / {images.length}
							</p>
						)}
					</div>

					{hasMany && (
						<button
							onClick={goNext}
							className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-accent)] transition-colors z-10 p-3"
							aria-label={a11y.next}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-8 h-8 md:w-10 md:h-10"
							>
								<polyline points="9 18 15 12 9 6" />
							</svg>
						</button>
					)}
				</div>
			)}
		</>
	);
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
