import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedHero({ children }) {
	const containerRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const timeline = gsap.timeline({
				defaults: { duration: 1.2, ease: "power3.out" },
			});

			// Fade and slide from bottom
			timeline
				.from(
					containerRef.current,
					{
						opacity: 0,
						y: 100,
					},
					0
				)
				.from(
					".hero-title",
					{
						opacity: 0,
						y: 50,
						stagger: 0.15,
					},
					0.3
				)
				.from(
					".hero-description",
					{
						opacity: 0,
						y: 30,
					},
					0.6
				)
				.from(
					".hero-accent-line",
					{
						scaleX: 0,
						transformOrigin: "left",
					},
					0.5
				)
				.from(
					".scroll-indicator",
					{
						opacity: 0,
						y: 20,
					},
					0.8
				);
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return <div ref={containerRef}>{children}</div>;
}
