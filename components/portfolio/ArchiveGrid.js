import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function ArchiveGrid({ items, title, description }) {
	const imageItems = items.filter((it) => it.type !== "pdf");
	const [openIndex, setOpenIndex] = useState(null);

	const closeModal = useCallback(() => setOpenIndex(null), []);
	const goPrev = useCallback(() => {
		setOpenIndex((i) =>
			i === null ? null : (i - 1 + imageItems.length) % imageItems.length,
		);
	}, [imageItems.length]);
	const goNext = useCallback(() => {
		setOpenIndex((i) => (i === null ? null : (i + 1) % imageItems.length));
	}, [imageItems.length]);

	useEffect(() => {
		if (openIndex === null) return;
		const onKey = (e) => {
			if (e.key === "Escape") closeModal();
			else if (e.key === "ArrowLeft") goPrev();
			else if (e.key === "ArrowRight") goNext();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [openIndex, closeModal, goPrev, goNext]);

	const onBackdropClick = (e) => {
		if (e.target === e.currentTarget) closeModal();
	};

	const openImage = (src) => {
		const idx = imageItems.findIndex((it) => it.src === src);
		if (idx >= 0) setOpenIndex(idx);
	};

	const current = openIndex !== null ? imageItems[openIndex] : null;

	return (
		<section className="section border-t border-[var(--color-border)] mt-24 pt-16">
			<div className="container-editorial">
				<div className="mb-10 max-w-xl">
					<h2 className="display-sm mb-2">{title}</h2>
					<p className="body-sm text-[var(--color-text-light)]">
						{description}
					</p>
				</div>

				<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
					{items.map((item) => {
						const isPdf = item.type === "pdf";
						const Wrapper = isPdf ? "a" : "button";
						const wrapperProps = isPdf
							? {
									href: item.src,
									target: "_blank",
									rel: "noopener noreferrer nofollow",
							  }
							: {
									type: "button",
									onClick: () => openImage(item.src),
							  };

						return (
							<li key={item.src}>
								<Wrapper
									{...wrapperProps}
									className="block w-full text-left group"
								>
									<div className="relative w-full aspect-[4/3] bg-[var(--color-bg-alt)] overflow-hidden rounded-md">
										{isPdf ? (
											<div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-light)] text-sm">
												PDF
											</div>
										) : (
											<Image
												src={item.src}
												alt={item.caption}
												fill
												sizes="(max-width: 768px) 50vw, 20vw"
												className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
												loading="lazy"
											/>
										)}
									</div>
									<p className="mt-3 text-sm text-[var(--color-text-light)] group-hover:text-[var(--color-text)] transition-colors">
										{item.caption}
									</p>
								</Wrapper>
							</li>
						);
					})}
				</ul>
			</div>

			{current && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
					onClick={onBackdropClick}
				>
					{/* Prev */}
					<button
						onClick={goPrev}
						className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-accent)] transition-colors z-10"
						aria-label="Anterior"
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

					<div className="relative max-w-3xl max-h-[80vh] m-4">
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
						<Image
							key={current.src}
							src={current.src}
							alt={current.caption}
							width={1200}
							height={900}
							className="object-contain max-h-[80vh] w-auto rounded-lg"
						/>
						<p className="mt-3 text-sm text-white/80 text-center">
							{current.caption}
							<span className="ml-2 text-white/50">
								{openIndex + 1} / {imageItems.length}
							</span>
						</p>
					</div>

					{/* Next */}
					<button
						onClick={goNext}
						className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-accent)] transition-colors z-10"
						aria-label="Siguiente"
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
				</div>
			)}
		</section>
	);
}
