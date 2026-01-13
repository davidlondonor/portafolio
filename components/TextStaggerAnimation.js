import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TextStaggerAnimation({
	text,
	className = "",
	trigger = true,
}) {
	const containerRef = useRef(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const words = text.split(" ");
		containerRef.current.innerHTML = words
			.map(
				(word) =>
					`<span class="word"><span class="inner">${word}</span></span>`
			)
			.join(" ");

		const ctx = gsap.context(() => {
			const timeline = gsap.timeline({
				scrollTrigger: trigger
					? {
							trigger: containerRef.current,
							start: "top 70%",
							once: true,
					  }
					: undefined,
			});

			timeline.from(
				containerRef.current?.querySelectorAll(".inner"),
				{
					opacity: 0,
					y: 100,
					duration: 0.6,
					stagger: 0.05,
					ease: "power4.out",
				},
				0
			);
		}, containerRef);

		return () => ctx.revert();
	}, [text, trigger]);

	return (
		<div
			ref={containerRef}
			className={className}
			style={{
				overflow: "hidden",
			}}
		>
			{text}
		</div>
	);
}
