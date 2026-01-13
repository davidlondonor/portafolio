import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function RevealOnScroll({
	children,
	className = "",
	stagger = false,
}) {
	const elementRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const target = stagger
				? elementRef.current?.querySelectorAll(".reveal-item")
				: elementRef.current;

			gsap.from(target, {
				opacity: 0,
				y: 50,
				duration: 0.8,
				stagger: stagger ? 0.1 : 0,
				ease: "power3.out",
				scrollTrigger: {
					trigger: elementRef.current,
					start: "top 70%",
					once: true,
				},
			});
		}, elementRef);

		return () => ctx.revert();
	}, [stagger]);

	return (
		<div ref={elementRef} className={className}>
			{children}
		</div>
	);
}
