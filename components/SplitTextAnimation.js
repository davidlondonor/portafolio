import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SplitTextAnimation({
	children,
	className = "",
	triggerOnScroll = true,
}) {
	const elementRef = useRef(null);

	useEffect(() => {
		if (!elementRef.current) return;

		const text = elementRef.current.textContent;
		const chars = text.split("");

		// Clear and rebuild with spans
		elementRef.current.innerHTML = chars
			.map(
				(char) =>
					`<span class="char">${char === " " ? "&nbsp;" : char}</span>`
			)
			.join("");

		if (triggerOnScroll) {
			// Animate on scroll into view
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							gsap.to(entry.target.querySelectorAll(".char"), {
								opacity: 1,
								y: 0,
								duration: 0.6,
								stagger: 0.02,
								ease: "power2.out",
							});
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.5 }
			);

			observer.observe(elementRef.current);

			return () => observer.disconnect();
		} else {
			// Animate immediately
			gsap.to(elementRef.current.querySelectorAll(".char"), {
				opacity: 1,
				y: 0,
				duration: 0.6,
				stagger: 0.02,
				ease: "power2.out",
			});
		}
	}, [triggerOnScroll]);

	return (
		<span
			ref={elementRef}
			className={className}
			style={{
				display: "inline-block",
			}}
		>
			{children}
		</span>
	);
}
