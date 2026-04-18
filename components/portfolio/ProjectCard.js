import Image from "next/image";
import { forwardRef, useState } from "react";

const ProjectCard = forwardRef(({ project }, ref) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	};

	return (
		<>
			<div
				ref={ref}
				className="card-minimal overflow-hidden hover:border-[var(--color-accent)] transition-colors group"
			>
				{/* Image */}
				<div
					className="relative w-full aspect-[4/3] bg-[var(--color-bg-alt)] overflow-hidden rounded-[1.5rem] cursor-pointer"
					onClick={openModal}
				>
					<Image
						src={project.image}
						alt={`${project.title} - ${project.description}`}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-contain transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
					/>
					<span className="absolute top-4 left-4 number-indicator bg-[var(--color-bg)]/90 backdrop-blur-sm px-3 py-1">
						{project.num}
					</span>
				</div>

				{/* Content */}
				<div className="p-6">
					<h3 className="display-sm mb-2">{project.title}</h3>

					<p className="body-sm text-[var(--color-accent)] font-bold mb-3">
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
			{isModalOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
					onClick={handleBackdropClick}
				>
					<div className="relative max-w-3xl max-h-[80vh] m-4">
						{/* Close button */}
						<button
							onClick={closeModal}
							className="absolute -top-10 right-0 text-white hover:text-[var(--color-accent)] transition-colors z-10"
							aria-label="Cerrar"
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

						{/* Image */}
						<Image
							src={project.image}
							alt={`${project.title} - ${project.description}`}
							width={1200}
							height={900}
							className="object-contain max-h-[80vh] w-auto rounded-lg"
						/>
					</div>
				</div>
			)}
		</>
	);
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
