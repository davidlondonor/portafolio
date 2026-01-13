import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MorphingShapes() {
	const containerRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animated background shapes
			const shapes = containerRef.current?.querySelectorAll(".shape");

			shapes?.forEach((shape, i) => {
				gsap.to(shape, {
					x: () => gsap.utils.random(-20, 20),
					y: () => gsap.utils.random(-20, 20),
					rotation: 360,
					duration: gsap.utils.random(20, 30),
					repeat: -1,
					ease: "none",
				});
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative w-full h-screen overflow-hidden bg-[var(--color-bg)]"
		>
			{/* Animated shapes */}
			<div className="shape absolute top-10 left-10 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl"></div>
			<div className="shape absolute bottom-10 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
			<div className="shape absolute top-1/2 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
		</div>
	);
}
