import Image from "next/image";
import { forwardRef } from "react";

const ProjectCard = forwardRef(({ project }, ref) => {
	return (
		<div
			ref={ref}
			className="card-minimal overflow-hidden hover:border-[var(--color-accent)] transition-colors group"
		>
			{/* Image */}
			<div className="relative w-full aspect-[4/3] bg-[var(--color-bg-alt)] overflow-hidden rounded-[1.5rem]">
				<Image
					src={project.image}
					alt={`${project.title} - ${project.description}`}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
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
	);
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
