import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CardAnimation({ children, delay = 0 }) {
	const cardRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(cardRef.current, {
				opacity: 0,
				y: 60,
				duration: 0.8,
				delay,
				ease: "power3.out",
				scrollTrigger: {
					trigger: cardRef.current,
					start: "top 80%",
					once: true,
				},
			});

			// Hover effect
			cardRef.current.addEventListener("mouseenter", () => {
				gsap.to(cardRef.current, {
					y: -10,
					duration: 0.3,
					ease: "power2.out",
				});
			});

			cardRef.current.addEventListener("mouseleave", () => {
				gsap.to(cardRef.current, {
					y: 0,
					duration: 0.3,
					ease: "power2.out",
				});
			});
		}, cardRef);

		return () => ctx.revert();
	}, [delay]);

	return <div ref={cardRef}>{children}</div>;
}
