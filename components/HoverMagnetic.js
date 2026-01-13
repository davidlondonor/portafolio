import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HoverMagnetic({ children, strength = 30 }) {
	const elementRef = useRef(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		const onMouseMove = (e) => {
			const rect = element.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const distX = e.clientX - centerX;
			const distY = e.clientY - centerY;
			const distance = Math.sqrt(distX * distX + distY * distY);

			if (distance < 200) {
				const moveX = (distX / distance) * strength;
				const moveY = (distY / distance) * strength;

				gsap.to(element, {
					x: moveX,
					y: moveY,
					duration: 0.3,
					overwrite: "auto",
				});
			}
		};

		const onMouseLeave = () => {
			gsap.to(element, {
				x: 0,
				y: 0,
				duration: 0.5,
				ease: "elastic.out(1, 0.3)",
			});
		};

		document.addEventListener("mousemove", onMouseMove);
		element.addEventListener("mouseleave", onMouseLeave);

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			element.removeEventListener("mouseleave", onMouseLeave);
		};
	}, [strength]);

	return (
		<div ref={elementRef} style={{ position: "relative" }}>
			{children}
		</div>
	);
}
